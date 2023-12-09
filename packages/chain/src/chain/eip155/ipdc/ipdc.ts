/* eslint no-template-curly-in-string: 0 */
export const ipdc = {
  name: "PDC Mainnet",
  shortName: "ipdc",
  chain: "IPDC",
  rpc: [
    "https://mainnet.ipdc.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "PDC",
    symbol: "PDC",
    decimals: 18,
  },
  infoURL: "https://ipdc.io",
  chainId: 666301171999,
  networkId: 666301171999,
  explorers: [
    {
      name: "ipdcscan",
      url: "https://scan.ipdc.io",
      standard: "EIP3091",
    },
  ],
} as const
