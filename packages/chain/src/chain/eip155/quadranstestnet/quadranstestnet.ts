/* eslint no-template-curly-in-string: 0 */
export const quadranstestnet = {
  name: "Quadrans Blockchain Testnet",
  shortName: "quadranstestnet",
  chain: "tQDC",
  icon: "quadrans",
  rpc: [
    "https://rpctest.quadrans.io",
    "https://rpctest2.quadrans.io",
  ],
  faucets: [
    "https://faucetpage.quadrans.io",
  ],
  nativeCurrency: {
    name: "Quadrans Testnet Coin",
    symbol: "tQDC",
    decimals: 18,
  },
  infoURL: "https://quadrans.io",
  chainId: 10947,
  networkId: 10947,
  explorers: [
    {
      name: "explorer",
      url: "https://explorer.testnet.quadrans.io",
      standard: "EIP3091",
    },
  ],
} as const