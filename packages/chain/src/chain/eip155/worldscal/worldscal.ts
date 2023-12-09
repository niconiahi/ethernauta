/* eslint no-template-curly-in-string: 0 */
export const worldscal = {
  name: "Worlds Caldera",
  shortName: "worldscal",
  chain: "WCal",
  icon: "ethereum",
  rpc: [
    "https://worlds-test.calderachain.xyz/http",
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://caldera.xyz/",
  chainId: 4281033,
  networkId: 4281033,
  explorers: [],
} as const
