// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_812397 = {
  name: "SG Verse Mainnet",
  shortName: "SGV",
  chain: "SG Verse",
  icon: "sg_verse",
  rpc: ["https://rpc.sgverse.net/"],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "",
  chainId: 812397,
  networkId: 812397,
  explorers: [
    {
      name: "SG Verse Explorer",
      url: "https://explorer.sgverse.net",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-248",
  },
} satisfies Chain
