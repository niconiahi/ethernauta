/* eslint no-template-curly-in-string: 0 */
export const nnw = {
  name: "Nova Network",
  shortName: "nnw",
  chain: "NNW",
  icon: "novanetwork",
  rpc: [
    "https://connect.novanetwork.io",
    "https://0x57.redjackstudio.com",
    "https://rpc.novanetwork.io:9070",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Supernova",
    symbol: "SNT",
    decimals: 18,
  },
  infoURL: "https://novanetwork.io",
  chainId: 87,
  networkId: 87,
  explorers: [
    {
      name: "novanetwork",
      url: "https://explorer.novanetwork.io",
      standard: "EIP3091",
    },
  ],
} as const