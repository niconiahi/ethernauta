/* eslint no-template-curly-in-string: 0 */
export const eip155_1708 = {
  name: "TBSI Testnet",
  shortName: "tTBSI",
  title: "Thai Blockchain Service Infrastructure Testnet",
  chain: "TBSI",
  rpc: [
    "https://rpc.testnet.blockchain.or.th",
  ],
  faucets: [
    "https://faucet.blockchain.or.th",
  ],
  nativeCurrency: {
    name: "Jinda",
    symbol: "JINDA",
    decimals: 18,
  },
  infoURL: "https://blockchain.or.th",
  chainId: 1708,
  networkId: 1708,
  explorers: [
    {
      name: "blockscout",
      url: "https://exp.testnet.blockchain.or.th",
      standard: "EIP3091",
    },
  ],
} as const