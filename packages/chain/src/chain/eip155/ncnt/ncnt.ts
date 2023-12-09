/* eslint no-template-curly-in-string: 0 */
export const ncnt = {
  name: "Neurochain Testnet",
  shortName: "ncnt",
  chain: "NCN",
  rpc: [
    "https://nc-rpc-test1.neurochain.io",
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
    name: "Neurochain",
    symbol: "tNCN",
    decimals: 18,
  },
  infoURL: "https://www.neurochain.ai",
  chainId: 303,
  networkId: 303,
  explorers: [
    {
      name: "neuroscan",
      url: "https://testnet.ncnscan.com",
      standard: "EIP3091",
    },
  ],
} as const
