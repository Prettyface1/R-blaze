import { ChainhooksClient } from '@hirosystems/chainhooks-client';
const client = new ChainhooksClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.hiro.so',
});
export const registerResearchHook = async (projectId: string) => {
  await client.register({
    name: `research-boost-${projectId}`,
    chain: 'stacks',
    network: 'mainnet',
  });
};
