/* eslint no-template-curly-in-string: 0 */
export const core = {
  name: "Core Blockchain Mainnet",
  shortName: "core",
  chain: "Core",
  icon: "core",
  rpc: [
    "https://rpc.coredao.org/",
    "https://rpc-core.icecreamswap.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Core Blockchain Native Token",
    symbol: "CORE",
    decimals: 18,
  },
  infoURL: "https://www.coredao.org",
  chainId: 1116,
  networkId: 1116,
  explorers: [
    {
      name: "Core Scan",
      url: "https://scan.coredao.org",
      standard: "EIP3091",
    },
  ],
} as const
