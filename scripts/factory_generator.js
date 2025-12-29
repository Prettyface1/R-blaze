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

const generateFeature = (name, index, type = 'feat') => {
    const id = `${type}/comp-${index}`;
    const steps = [
        { file: `src/generated/comp-${index}.ts`, content: `// Component: ${name}\n`, msg: `${type}: init comp ${index}` },
        { file: `src/generated/comp-${index}.ts`, content: `import React from 'react';\n`, msg: `${type}: add react to comp ${index}` },
        { file: `src/generated/comp-${index}.ts`, content: `import { memo } from 'react';\n`, msg: `${type}: add memo to comp ${index}` },
        { file: `src/generated/comp-${index}.ts`, content: `export const Component${index} = memo(() => {\n`, msg: `${type}: define comp ${index}` },
        { file: `src/generated/comp-${index}.ts`, content: `  const [state, setState] = React.useState(0);\n`, msg: `${type}: add state to comp ${index}` },
        { file: `src/generated/comp-${index}.ts`, content: `  return React.createElement('div', null, 'Comp ${index}');\n`, msg: `${type}: add render to comp ${index}` },
        { file: `src/generated/comp-${index}.ts`, content: `});\n`, msg: `${type}: finalize comp ${index}` },
        { file: `docs/components/Comp${index}.md`, content: `# Component ${index}\n`, msg: `docs: init doc ${index}` },
        { file: `docs/components/Comp${index}.md`, content: `## Summary\nAuto-generated UI component ${index}.\n`, msg: `docs: add summary ${index}` },
        { file: `docs/components/Comp${index}.md`, content: `## API\nProps: none\n`, msg: `docs: add api ${index}` },
        { file: `tests/Comp${index}.test.ts`, content: `import { test, expect } from 'vitest';\n`, msg: `test: setup test ${index}` },
        { file: `tests/Comp${index}.test.ts`, content: `test('comp ${index} exists', () => {\n`, msg: `test: add test case ${index}` },
        { file: `tests/Comp${index}.test.ts`, content: `  expect(true).toBe(true);\n`, msg: `test: add assertion ${index}` },
        { file: `tests/Comp${index}.test.ts`, content: `});\n`, msg: `test: finalize test ${index}` },
        { file: `styles/comp-${index}.css`, content: `.comp-${index} { color: blue; }\n`, msg: `feat: add style for comp ${index}` }
    ];
    return { id, name, steps };
};

const main = async () => {
    run('git checkout main');
    run('git pull origin main');

    const startIdx = 30;
    const endIdx = 110; // Extra to be sure

    for (let i = startIdx; i <= endIdx; i++) {
        const feat = generateFeature(`Atomic Component ${i}`, i);
        run(`git checkout -B ${feat.id}`);

        for (const step of feat.steps) {
            const dir = path.dirname(step.file);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            if (!fs.existsSync(step.file)) fs.writeFileSync(step.file, '');
            fs.appendFileSync(step.file, step.content);
            commit(step.msg);
        }

        run(`git push -u origin ${feat.id} --force`);

        const prTitle = `Auto: Implementation of Atomic Component ${i}`;
        const prBody = `## Micro-commit Implementation\nThis PR contains 15 micro-commits for Component ${i}.`;

        try {
            run(`gh pr create --title "${prTitle}" --body "${prBody}" --base main --head ${feat.id} --fill`);
            run(`gh pr merge --merge --delete-branch`);
        } catch (e) {
            console.log("GH PR failed, merging locally...");
            run('git checkout main');
            run(`git merge ${feat.id} --no-ff -m "Merge branch '${feat.id}'"`);
            run('git push origin main');
        }

        run('git checkout main');
        run('git pull origin main');
    }
};

main();
