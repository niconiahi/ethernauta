/* eslint no-template-curly-in-string: 0 */
export const bitci = {
  name: "Bitcichain Mainnet",
  shortName: "bitci",
  chain: "BITCI",
  icon: "bitci",
  rpc: [
    "https://rpc.bitci.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Bitci",
    symbol: "BITCI",
    decimals: 18,
  },
  infoURL: "https://www.bitcichain.com",
  chainId: 1907,
  networkId: 1907,
  explorers: [
    {
      name: "Bitci Explorer",
      url: "https://bitciexplorer.com",
      standard: "EIP3091",
    },
  ],
} as const