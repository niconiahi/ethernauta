/* eslint no-template-curly-in-string: 0 */
export const _ozoTst = {
  name: "Ozone Chain Testnet",
  shortName: "ozo_tst",
  chain: "OZONE",
  icon: "ozonechain",
  rpc: [
    "https://node1.testnet.ozonechain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OZONE",
    symbol: "OZO",
    decimals: 18,
  },
  infoURL: "https://ozonechain.io",
  chainId: 401,
  networkId: 401,
  explorers: [
    {
      name: "OZONE Scan",
      url: "https://testnet.ozonescan.io",
      standard: "EIP3091",
    },
  ],
} as const
