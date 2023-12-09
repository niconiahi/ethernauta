/* eslint no-template-curly-in-string: 0 */
export const tcore = {
  name: "Core Blockchain Testnet",
  shortName: "tcore",
  chain: "Core",
  icon: "core",
  rpc: [
    "https://rpc.test.btcs.network/",
  ],
  faucets: [
    "https://scan.test.btcs.network/faucet",
  ],
  nativeCurrency: {
    name: "Core Blockchain Testnet Native Token",
    symbol: "tCORE",
    decimals: 18,
  },
  infoURL: "https://www.coredao.org",
  chainId: 1115,
  networkId: 1115,
  explorers: [
    {
      name: "Core Scan Testnet",
      url: "https://scan.test.btcs.network",
      standard: "EIP3091",
    },
  ],
} as const
