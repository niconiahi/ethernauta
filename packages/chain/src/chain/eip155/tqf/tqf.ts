/* eslint no-template-curly-in-string: 0 */
export const tqf = {
  name: "Torus Mainnet",
  shortName: "tqf",
  chain: "TQF",
  icon: "torus",
  rpc: [
    "https://rpc.toruschain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TQF",
    symbol: "TQF",
    decimals: 18,
  },
  infoURL: "https://docs.toruschain.com",
  chainId: 8192,
  networkId: 8192,
  explorers: [
    {
      name: "blockscout",
      url: "https://toruscan.com",
      standard: "EIP3091",
    },
  ],
} as const
