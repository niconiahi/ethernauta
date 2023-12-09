/* eslint no-template-curly-in-string: 0 */
export const taycanTestnet = {
  name: "Taycan Testnet",
  shortName: "taycan-testnet",
  chain: "Taycan",
  icon: "shuffle",
  rpc: [
    "https://test-taycan.hupayx.io",
  ],
  faucets: [
    "https://ttaycan-faucet.hupayx.io/",
  ],
  nativeCurrency: {
    name: "test-Shuffle",
    symbol: "tSFL",
    decimals: 18,
  },
  infoURL: "https://hupayx.io",
  chainId: 2023,
  networkId: 2023,
  explorers: [
    {
      name: "Taycan Explorer(Blockscout)",
      url: "https://evmscan-test.hupayx.io",
      standard: "none",
    },
    {
      name: "Taycan Cosmos Explorer",
      url: "https://cosmoscan-test.hupayx.io",
      standard: "none",
    },
  ],
} as const
