/* eslint no-template-curly-in-string: 0 */
export const eip155_92001 = {
  name: "Lambda Testnet",
  shortName: "lambda-testnet",
  chain: "Lambda",
  icon: "lambda",
  rpc: [
    "https://evm.lambda.top/",
  ],
  faucets: [
    "https://faucet.lambda.top",
  ],
  nativeCurrency: {
    name: "test-Lamb",
    symbol: "LAMB",
    decimals: 18,
  },
  infoURL: "https://lambda.im",
  chainId: 92001,
  networkId: 92001,
  explorers: [
    {
      name: "Lambda EVM Explorer",
      url: "https://explorer.lambda.top",
      standard: "EIP3091",
    },
  ],
} as const
