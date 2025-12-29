import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = (cmd) => {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { encoding: 'utf8' });
    } catch (e) {
        console.error(e.message);
        return null;
    }
};

const commit = (msg) => {
    run('git add .');
    run(`git commit -m "${msg}"`);
};

const main = () => {
    // Initial commit
    commit("chore: initial base files");

    // Start creating structure
    const dirs = [
        'src',
        'src/components',
        'src/components/ui',
        'src/components/layout',
        'src/hooks',
        'src/pages',
        'src/styles',
        'src/utils',
        'src/contracts',
        'src/types',
        'public',
        'docs'
    ];

    run('git checkout -b setup/directory-structure');
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            // Create a .gitkeep or dummy file to allow commit
            fs.writeFileSync(path.join(dir, '.gitkeep'), '');
            commit(`feat: create directory ${dir}`);
        }
    }
};

main();
