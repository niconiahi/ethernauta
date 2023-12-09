/* eslint no-template-curly-in-string: 0 */
export const eip155_4000 = {
  name: "Ozone Chain Mainnet",
  shortName: "ozo",
  chain: "OZONE",
  icon: "ozonechain",
  rpc: [
    "https://node1.ozonechain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OZONE",
    symbol: "OZO",
    decimals: 18,
  },
  infoURL: "https://ozonechain.io",
  chainId: 4000,
  networkId: 4000,
  explorers: [
    {
      name: "OZONE Scan",
      url: "https://ozonescan.io",
      standard: "EIP3091",
    },
  ],
} as const
