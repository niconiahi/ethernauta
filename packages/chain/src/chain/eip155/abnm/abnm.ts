/* eslint no-template-curly-in-string: 0 */
export const abNm = {
  name: "Antofy Mainnet",
  shortName: "ABNm",
  chain: "ABN",
  icon: "antofy",
  rpc: [
    "https://rpc.antofy.io",
  ],
  faucets: [
    "https://faucet.antofy.io",
  ],
  nativeCurrency: {
    name: "Antofy",
    symbol: "ABN",
    decimals: 18,
  },
  infoURL: "https://antofy.io",
  chainId: 2202,
  networkId: 2202,
  explorers: [
    {
      name: "Antofy Mainnet",
      url: "https://antofyscan.com",
      standard: "EIP3091",
    },
  ],
} as const
