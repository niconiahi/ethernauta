/* eslint no-template-curly-in-string: 0 */
export const elst = {
  name: "Elysium Testnet",
  shortName: "ELST",
  title: "An L1, carbon-neutral, tree-planting, metaverse dedicated blockchain created by VulcanForged",
  chain: "Elysium",
  rpc: [
    "https://elysium-test-rpc.vulcanforged.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "LAVA",
    symbol: "LAVA",
    decimals: 18,
  },
  infoURL: "https://elysiumscan.vulcanforged.com",
  chainId: 1338,
  networkId: 1338,
  explorers: [
    {
      name: "Elysium testnet explorer",
      url: "https://elysium-explorer.vulcanforged.com",
      standard: "none",
    },
  ],
} as const
