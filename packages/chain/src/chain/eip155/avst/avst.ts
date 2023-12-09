/* eslint no-template-curly-in-string: 0 */
export const avst = {
  name: "Aves Testnet",
  shortName: "avst",
  chain: "AVST",
  icon: "aves",
  rpc: [
    "https://test.rpc.avescoin.io",
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
    name: "AvesT",
    symbol: "AVST",
    decimals: 18,
  },
  infoURL: "https://ethereum.org",
  chainId: 333331,
  networkId: 333331,
  explorers: [
    {
      name: "avescan",
      url: "https://testnet.avescoin.io",
      standard: "EIP3091",
    },
  ],
} as const
