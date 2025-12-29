import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
export const contributeToResearch = async (amount: number) => {
  await openContractCall({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'R-blaze',
    functionName: 'fund-project',
    functionArgs: [uintCV(amount)],
    postConditionMode: PostConditionMode.Allow,
  });
};
