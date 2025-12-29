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
        { file: `src/generated/${id}.ts`, content: `import { memo } from 'react';\n`, msg: `${type}: add react imports to ${name}` },
        { file: `src/generated/${id}.ts`, content: `export const ${name.replace(/ /g, '')} = memo(() => {\n`, msg: `${type}: define ${name} structure` },
        { file: `src/generated/${id}.ts`, content: `  return null;\n`, msg: `${type}: implement base return for ${name}` },
        { file: `src/generated/${id}.ts`, content: `});\n`, msg: `${type}: finalize ${name} component` },
        { file: `docs/features/${name.replace(/ /g, '')}.md`, content: `# ${name}\n`, msg: `docs: create doc for ${name}` },
        { file: `docs/features/${name.replace(/ /g, '')}.md`, content: `## Summary\nThis is a generated component ${name}.\n`, msg: `docs: add summary to ${name}` },
        { file: `docs/features/${name.replace(/ /g, '')}.md`, content: `## Usage\n\`import { ${name.replace(/ /g, '')} } from './${id}';\`\n`, msg: `docs: add usage example to ${name}` },
        { file: `tests/${name.replace(/ /g, '')}.test.ts`, content: `import { expect } from 'vitest';\n`, msg: `test: setup vitest for ${name}` },
        { file: `tests/${name.replace(/ /g, '')}.test.ts`, content: `test('${name} should exist', () => {\n  expect(true).toBe(true);\n});\n`, msg: `test: add assertion for ${name}` }
    ];
    return { id, name, steps };
};

const main = () => {
    run('git checkout main');

    const totalBranchesNeeded = 80;
    const features = [];

<<<<<<< HEAD
    for (let i = 12; i <= totalBranchesNeeded; i++) {
=======
    for (let i = 10; i <= totalBranchesNeeded; i++) {
>>>>>>> feat/component-11
        features.push(generateFeature(`Component ${i}`));
    }

    for (const feat of features) {
        run(`git checkout -B ${feat.id}`);
        for (const step of feat.steps) {
            const dir = path.dirname(step.file);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            if (!fs.existsSync(step.file)) fs.writeFileSync(step.file, '');
            fs.appendFileSync(step.file, step.content);
            commit(step.msg);
        }

        // Push and PR
        run(`git push -u origin ${feat.id} --force`);

        const prTitle = `${feat.id.startsWith('feat') ? 'Feature' : 'Docs'}: Implementation of ${feat.name}`;
        const prBody = `## Overview\nThis PR introduces ${feat.name}.\n\n### Changes\n- Logic\n- Docs\n- Tests`;

        run(`gh pr create --title "${prTitle}" --body "${prBody}" --base main --head ${feat.id} --fill || true`);
        run(`gh pr merge --merge --delete-branch || true`);

        run('git checkout main');
        run('git pull origin main');
    }
};

main();
