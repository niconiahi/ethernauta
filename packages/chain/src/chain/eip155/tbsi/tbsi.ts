/* eslint no-template-curly-in-string: 0 */
export const tbsi = {
  name: "TBSI Mainnet",
  shortName: "TBSI",
  title: "Thai Blockchain Service Infrastructure Mainnet",
  chain: "TBSI",
  rpc: [
    "https://rpc.blockchain.or.th",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Jinda",
    symbol: "JINDA",
    decimals: 18,
  },
  infoURL: "https://blockchain.or.th",
  chainId: 1707,
  networkId: 1707,
  explorers: [
    {
      name: "blockscout",
      url: "https://exp.blockchain.or.th",
      standard: "EIP3091",
    },
  ],
} as const
