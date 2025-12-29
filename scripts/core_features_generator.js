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

const coreFeatures = [
    {
        id: 'feat/stacks-connect-auth',
        name: 'Stacks Connect Authentication',
        steps: [
            { file: 'src/lib/stacks-auth.ts', content: "import { AppConfig, UserSession, showConnect } from '@stacks/connect';\n", msg: 'feat: add stacks connect authentication imports' },
            { file: 'src/lib/stacks-auth.ts', content: "const appConfig = new AppConfig(['store_write', 'publish_data']);\n", msg: 'feat: configure stacks app config' },
            { file: 'src/lib/stacks-auth.ts', content: "export const userSession = new UserSession({ appConfig });\n", msg: 'feat: initialize stacks user session' },
            { file: 'src/lib/stacks-auth.ts', content: "export const authenticate = () => {\n", msg: 'feat: define authentication function' },
            { file: 'src/lib/stacks-auth.ts', content: "  showConnect({\n    appDetails: { name: 'R-blaze', icon: '/logo.png' },\n", msg: 'feat: add app details to connect modal' },
            { file: 'src/lib/stacks-auth.ts', content: "    onFinish: () => window.location.reload(),\n    userSession,\n  });\n};\n", msg: 'feat: implement onFinish callback' }
        ]
    },
    {
        id: 'feat/stacks-transactions',
        name: 'Stacks Transactions Integration',
        steps: [
            { file: 'src/lib/stacks-tx.ts', content: "import { openContractCall } from '@stacks/connect';\n", msg: 'feat: add stacks transactions imports' },
            { file: 'src/lib/stacks-tx.ts', content: "import { uintCV, PostConditionMode } from '@stacks/transactions';\n", msg: 'feat: add stacks cv imports' },
            { file: 'src/lib/stacks-tx.ts', content: "export const contributeToResearch = async (amount: number) => {\n", msg: 'feat: define contribute function' },
            { file: 'src/lib/stacks-tx.ts', content: "  await openContractCall({\n    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',\n", msg: 'feat: set target contract address' },
            { file: 'src/lib/stacks-tx.ts', content: "    contractName: 'R-blaze',\n    functionName: 'fund-project',\n", msg: 'feat: set target function name' },
            { file: 'src/lib/stacks-tx.ts', content: "    functionArgs: [uintCV(amount)],\n", msg: 'feat: encode transaction arguments' },
            { file: 'src/lib/stacks-tx.ts', content: "    postConditionMode: PostConditionMode.Allow,\n  });\n};\n", msg: 'feat: configure post conditions' }
        ]
    },
    {
        id: 'feat/wallet-connect-v2',
        name: 'WalletConnect v2 Implementation',
        steps: [
            { file: 'src/lib/wallet-connect.ts', content: "import { EthereumProvider } from '@walletconnect/ethereum-provider';\n", msg: 'feat: add walletconnect provider imports' },
            { file: 'src/lib/wallet-connect.ts', content: "const PROJECT_ID = 'your_project_id';\n", msg: 'feat: set walletconnect project id' },
            { file: 'src/lib/wallet-connect.ts', content: "export const initWalletConnect = async () => {\n", msg: 'feat: define walletconnect init function' },
            { file: 'src/lib/wallet-connect.ts', content: "  const provider = await EthereumProvider.init({\n", msg: 'feat: initialize ethereum provider' },
            { file: 'src/lib/wallet-connect.ts', content: "    projectId: PROJECT_ID,\n    showQrModal: true,\n    chains: [1],\n  });\n", msg: 'feat: configure wc provider metadata' },
            { file: 'src/lib/wallet-connect.ts', content: "  return provider;\n};\n", msg: 'feat: return provider instance' }
        ]
    },
    {
        id: 'feat/chainhooks-client',
        name: 'Hiro Chainhooks Integration',
        steps: [
            { file: 'src/lib/chainhooks.ts', content: "import { ChainhooksClient } from '@hirosystems/chainhooks-client';\n", msg: 'feat: add chainhooks client imports' },
            { file: 'src/lib/chainhooks.ts', content: "const client = new ChainhooksClient({\n  apiKey: 'YOUR_API_KEY',\n  baseUrl: 'https://api.hiro.so',\n});\n", msg: 'feat: initialize chainhooks client' },
            { file: 'src/lib/chainhooks.ts', content: "export const registerResearchHook = async (projectId: string) => {\n", msg: 'feat: define register hook function' },
            { file: 'src/lib/chainhooks.ts', content: "  await client.register({\n    name: `research-boost-${projectId}`,\n", msg: 'feat: set hook name' },
            { file: 'src/lib/chainhooks.ts', content: "    chain: 'stacks',\n    network: 'mainnet',\n  });\n};\n", msg: 'feat: configure hook network' }
        ]
    }
];

const main = () => {
    run('git checkout main');
    run('git pull origin main');

    for (const feat of coreFeatures) {
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

        const prTitle = `Core: ${feat.name}`;
        const prBody = `## Overview\nImplementing the core ${feat.name} functionality using a micro-commit strategy.\n\n### Technical Requirements\n- Integrates with ${feat.name} SDK\n- Follows R-blaze standards`;

        run(`gh pr create --title "${prTitle}" --body "${prBody}" --base main --head ${feat.id} --fill || true`);
        run(`gh pr merge --merge --delete-branch || true`);

        run('git checkout main');
        run('git pull origin main');
    }
};

main();
