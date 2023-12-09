/* eslint no-template-curly-in-string: 0 */
export const tCnt = {
  name: "Consta Testnet",
  shortName: "tCNT",
  chain: "tCNT",
  icon: "constachain",
  rpc: [
    "https://rpc-testnet.theconsta.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "tCNT",
    symbol: "tCNT",
    decimals: 18,
  },
  infoURL: "http://theconsta.com",
  chainId: 371,
  networkId: 371,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer-testnet.theconsta.com",
      standard: "EIP3091",
    },
  ],
} as const
