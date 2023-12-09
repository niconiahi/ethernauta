/* eslint no-template-curly-in-string: 0 */
export const brnkctest = {
  name: "Bear Network Chain Testnet",
  shortName: "BRNKCTEST",
  chain: "BRNKCTEST",
  icon: "brnkc",
  rpc: [
    "https://brnkc-test.bearnetwork.net",
  ],
  faucets: [
    "https://faucet.bearnetwork.net",
  ],
  nativeCurrency: {
    name: "Bear Network Chain Testnet Token",
    symbol: "tBRNKC",
    decimals: 18,
  },
  infoURL: "https://bearnetwork.net",
  chainId: 751230,
  networkId: 751230,
  explorers: [
    {
      name: "brnktestscan",
      url: "https://brnktest-scan.bearnetwork.net",
      standard: "EIP3091",
    },
  ],
} as const
