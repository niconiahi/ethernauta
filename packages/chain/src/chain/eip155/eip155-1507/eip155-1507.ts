/* eslint no-template-curly-in-string: 0 */
export const eip155_1507 = {
  name: "Sherpax Testnet",
  shortName: "SherpaxTestnet",
  chain: "Sherpax Testnet",
  rpc: [
    "https://sherpax-testnet.chainx.org/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "KSX",
    symbol: "KSX",
    decimals: 18,
  },
  infoURL: "https://sherpax.io/",
  chainId: 1507,
  networkId: 1507,
  explorers: [
    {
      name: "Sherpax Testnet Explorer",
      url: "https://evm-pre.sherpax.io",
      standard: "none",
    },
  ],
} as const
