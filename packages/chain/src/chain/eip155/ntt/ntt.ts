/* eslint no-template-curly-in-string: 0 */
export const ntt = {
  name: "Ntity Mainnet",
  shortName: "ntt",
  chain: "Ntity",
  icon: "ntity",
  rpc: [
    "https://rpc.ntity.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ntity",
    symbol: "NTT",
    decimals: 18,
  },
  infoURL: "https://ntity.io",
  chainId: 197710212030,
  networkId: 197710212030,
  explorers: [
    {
      name: "Ntity Blockscout",
      url: "https://blockscout.ntity.io",
      standard: "EIP3091",
    },
  ],
} as const
