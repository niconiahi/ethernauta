/* eslint no-template-curly-in-string: 0 */
export const miexs = {
  name: "Miexs Smartchain",
  shortName: "Miexs",
  chain: "MiexsSmartchain",
  icon: "miexs",
  rpc: [
    "https://mainnet-rpc.miexs.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Miexs Coin",
    symbol: "MIX",
    decimals: 18,
  },
  infoURL: "https://miexs.com",
  chainId: 761412,
  networkId: 761412,
  explorers: [
    {
      name: "Miexs Smartchain Explorer",
      url: "https://miexs.com",
      standard: "EIP3091",
    },
  ],
} as const
