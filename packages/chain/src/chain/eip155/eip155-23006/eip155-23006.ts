/* eslint no-template-curly-in-string: 0 */
export const eip155_23006 = {
  name: "Antofy Testnet",
  shortName: "ABNt",
  chain: "ABN",
  icon: "antofy",
  rpc: [
    "https://testnet-rpc.antofy.io",
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
  chainId: 23006,
  networkId: 23006,
  explorers: [
    {
      name: "Antofy Testnet",
      url: "https://test.antofyscan.com",
      standard: "EIP3091",
    },
  ],
} as const
