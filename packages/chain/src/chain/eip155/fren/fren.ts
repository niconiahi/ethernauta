/* eslint no-template-curly-in-string: 0 */
export const fren = {
  name: "Frenchain",
  shortName: "FREN",
  chain: "fren",
  icon: "fren",
  rpc: [
    "https://rpc-02.frenscan.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "FREN",
    symbol: "FREN",
    decimals: 18,
  },
  infoURL: "https://frenchain.app",
  chainId: 44444,
  networkId: 44444,
  explorers: [
    {
      name: "blockscout",
      url: "https://frenscan.io",
      standard: "EIP3091",
    },
  ],
} as const
