// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_101010 = {
  name: "Global Trust Network",
  shortName: "stabilityprotocol",
  chain: "GTN",
  icon: "gtn",
  rpc: ["https://gtn.stabilityprotocol.com"],
  faucets: [],
  nativeCurrency: {
    name: "FREE",
    symbol: "FREE",
    decimals: 18,
  },
  infoURL: "https://stabilityprotocol.com",
  chainId: 101010,
  networkId: 101010,
  explorers: [
    {
      name: "blockscout",
      url: "https://stability.blockscout.com",
      standard: "EIP3091",
    },
  ],
  redFlags: ["reusedChainId"],
} satisfies Chain
