/* eslint no-template-curly-in-string: 0 */
export const tresmain = {
  name: "Tres Mainnet",
  shortName: "TRESMAIN",
  chain: "TresLeches",
  icon: "tresleches",
  rpc: [
    "https://rpc.tresleches.finance/",
    "https://rpc.treschain.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TRES",
    symbol: "TRES",
    decimals: 18,
  },
  infoURL: "https://treschain.com",
  chainId: 6066,
  networkId: 6066,
  explorers: [
    {
      name: "treslechesexplorer",
      url: "https://explorer.tresleches.finance",
      standard: "EIP3091",
    },
  ],
} as const
