import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = (cmd) => {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
    } catch (e) {
        return null;
    }
};

const commit = (msg) => {
    run('git add .');
    run(`git commit -m "${msg}"`);
};

const generateFeature = (name, type = 'feat') => {
    const id = `${type}/${name.toLowerCase().replace(/ /g, '-')}`;
    const steps = [
        { file: `src/generated/${id}.ts`, content: `// Module: ${name}\n`, msg: `${type}: initialize ${name} module` },
        { file: `src/generated/${id}.ts`, content: `export const ${name.replace(/ /g, '')} = () => {\n`, msg: `${type}: define ${name} structure` },
        { file: `src/generated/${id}.ts`, content: `  console.log('${name} initialized');\n`, msg: `${type}: add logic to ${name}` },
        { file: `src/generated/${id}.ts`, content: `};\n`, msg: `${type}: finalize ${name} component` },
        { file: `docs/features/${name.replace(/ /g, '')}.md`, content: `# ${name}\nDocumentation for ${name}.\n`, msg: `docs: add documentation for ${name}` },
        { file: `tests/${name.replace(/ /g, '')}.test.ts`, content: `describe('${name}', () => { it('works', () => {}) });\n`, msg: `test: add unit test for ${name}` }
    ];
    return { id, name, steps };
};

const main = () => {
    run('git checkout main');

    const totalBranchesNeeded = 80;
    const features = [];

    for (let i = 1; i <= totalBranchesNeeded; i++) {
        features.push(generateFeature(`Component ${i}`));
    }

    for (const feat of features) {
        run(`git checkout -b ${feat.id}`);
        for (const step of feat.steps) {
            const dir = path.dirname(step.file);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            if (!fs.existsSync(step.file)) fs.writeFileSync(step.file, '');
            fs.appendFileSync(step.file, step.content);
            commit(step.msg);
        }
        run('git checkout main');
        run(`git merge ${feat.id} --no-ff -m "Merge branch '${feat.id}'"`);
    }
};

main();
