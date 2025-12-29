import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = (cmd) => {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
    } catch (e) {
        console.error(`Command failed: ${cmd}`);
        return null;
    }
};

const commit = (msg) => {
    run('git add .');
    run(`git commit -m "${msg}"`);
};

const features = [
    {
        id: 'feat/constants',
        name: 'Smart Contract Constants',
        steps: [
            { file: 'contracts/researchboost.clar', content: '(define-constant ERR-UNAUTHORIZED (err u100))\n', msg: 'feat: add unauthorized error constant' },
            { file: 'contracts/researchboost.clar', content: '(define-constant ERR-INVALID-AMOUNT (err u101))\n', msg: 'feat: add invalid amount error constant' },
            { file: 'contracts/researchboost.clar', content: '(define-constant ERR-NOT-FOUND (err u102))\n', msg: 'feat: add not found error constant' },
            { file: 'contracts/researchboost.clar', content: '(define-constant CONTRACT-OWNER tx-sender)\n', msg: 'feat: define contract owner constant' },
            { file: 'contracts/researchboost.clar', content: ';; Core data maps\n', msg: 'docs: add data map section header' }
        ]
    },
    {
        id: 'feat/staking-state',
        name: 'Staking State Management',
        steps: [
            { file: 'contracts/researchboost.clar', content: '(define-map user-stakes principal uint)\n', msg: 'feat: define user stakes map' },
            { file: 'contracts/researchboost.clar', content: '(define-data-var total-staked uint u0)\n', msg: 'feat: define total staked variable' },
            { file: 'contracts/researchboost.clar', content: ';; Read-only functions\n', msg: 'docs: add read-only functions section' }
        ]
    },
    {
        id: 'feat/read-only-logic',
        name: 'Contract Read Functions',
        steps: [
            { file: 'contracts/researchboost.clar', content: '(define-read-only (get-user-stake (user principal))\n  (default-to u0 (map-get? user-stakes user)))\n', msg: 'feat: implement get-user-stake' },
            { file: 'contracts/researchboost.clar', content: '(define-read-only (get-total-staked)\n  (var-get total-staked))\n', msg: 'feat: implement get-total-staked' }
        ]
    },
    {
        id: 'feat/stacks-provider',
        name: 'Stacks Context Provider',
        steps: [
            { file: 'src/hooks/useStacks.ts', content: "import { useState } from 'react';\n", msg: 'feat: initialize useStacks hook' },
            { file: 'src/hooks/useStacks.ts', content: "import { AppConfig, UserSession, showConnect } from '@stacks/connect';\n", msg: 'feat: add stacks connect imports' },
            { file: 'src/hooks/useStacks.ts', content: "const appConfig = new AppConfig(['store_write', 'publish_data']);\n", msg: 'feat: configure app config' },
            { file: 'src/hooks/useStacks.ts', content: "export const userSession = new UserSession({ appConfig });\n", msg: 'feat: create user session' }
        ]
    },
    {
        id: 'feat/wallet-connect-setup',
        name: 'WalletConnect Integration',
        steps: [
            { file: 'src/utils/walletConnect.ts', content: "import { EthereumProvider } from '@walletconnect/ethereum-provider';\n", msg: 'feat: add walletconnect provider import' },
            { file: 'src/utils/walletConnect.ts', content: "const projectId = 'r-blaze-id';\n", msg: 'feat: set walletconnect project id' },
            { file: 'src/utils/walletConnect.ts', content: "export const initWC = async () => {\n  return await EthereumProvider.init({ projectId, showQrModal: true, chains: [1] });\n};\n", msg: 'feat: implement initWC function' }
        ]
    }
];

const main = () => {
    // Ensure we are on a clean main
    run('git checkout -B main');
    fs.writeFileSync('INIT.md', '# R-blaze Project\nStarted with micro-commit strategy.');
    commit('chore: foundation commit');

    for (const feat of features) {
        run(`git checkout -b ${feat.id}`);
        for (const step of feat.steps) {
            const dir = path.dirname(step.file);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (!fs.existsSync(step.file)) {
                fs.writeFileSync(step.file, '');
            }
            fs.appendFileSync(step.file, step.content);
            commit(step.msg);
        }
        // Merge to main
        run('git checkout main');
        run(`git merge ${feat.id} --no-ff -m "Merge branch '${feat.id}': ${feat.name}"`);
    }
};

main();
