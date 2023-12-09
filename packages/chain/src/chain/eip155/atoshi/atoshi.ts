/* eslint no-template-curly-in-string: 0 */
export const atoshi = {
  name: "Atoshi Testnet",
  shortName: "atoshi",
  chain: "ATOSHI",
  icon: "atoshi",
  rpc: [
    "https://node.atoshi.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ATOSHI",
    symbol: "ATOS",
    decimals: 18,
  },
  infoURL: "https://atoshi.org",
  chainId: 167,
  networkId: 167,
  explorers: [
    {
      name: "atoshiscan",
      url: "https://scan.atoverse.info",
      standard: "EIP3091",
    },
  ],
} as const
