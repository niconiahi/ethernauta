/* eslint no-template-curly-in-string: 0 */
export const vlx = {
  name: "Velas EVM Mainnet",
  shortName: "vlx",
  chain: "Velas",
  icon: "velas",
  rpc: [
    "https://evmexplorer.velas.com/rpc",
    "https://explorer.velas.com/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Velas",
    symbol: "VLX",
    decimals: 18,
  },
  infoURL: "https://velas.com",
  chainId: 106,
  networkId: 106,
  explorers: [
    {
      name: "Velas Explorer",
      url: "https://evmexplorer.velas.com",
      standard: "EIP3091",
    },
  ],
} as const
