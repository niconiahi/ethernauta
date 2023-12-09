/* eslint no-template-curly-in-string: 0 */
export const team = {
  name: "T.E.A.M Blockchain",
  shortName: "team",
  chain: "TEAM",
  icon: "team",
  rpc: [
    "https://rpc.teamblockchain.team",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "TEAM",
    symbol: "$TEAM",
    decimals: 18,
  },
  infoURL: "https://teamblockchain.team",
  chainId: 88888888,
  networkId: 88888888,
  explorers: [
    {
      name: "teamscan",
      url: "https://teamblockchain.team",
      standard: "EIP3091",
    },
  ],
} as const