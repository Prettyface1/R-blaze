import { EthereumProvider } from '@walletconnect/ethereum-provider';
const PROJECT_ID = 'your_project_id';
export const initWalletConnect = async () => {
  const provider = await EthereumProvider.init({
    projectId: PROJECT_ID,
    showQrModal: true,
    chains: [1],
  });
  return provider;
};
