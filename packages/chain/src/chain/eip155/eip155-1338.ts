// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1338 = {
  name: "Elysium Testnet",
  shortName: "ATL",
  title:
    "An L1, carbon-neutral, tree-planting, metaverse dedicated blockchain created by VulcanForged",
  chain: "Atlantis",
  rpc: ["https://rpc.atlantischain.network"],
  faucets: ["https://faucet.atlantischain.network"],
  nativeCurrency: {
    name: "ELY",
    symbol: "ELY",
    decimals: 18,
  },
  infoURL: "https://elysiumchain.tech",
  chainId: 1338,
  networkId: 1338,
  explorers: [
    {
      name: "Atlantis explorer",
      url: "https://blockscout.atlantischain.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
