// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_122 = {
  name: "Fuse Mainnet",
  shortName: "fuse",
  chain: "FUSE",
  icon: "fuse",
  rpc: [
    "https://rpc.fuse.io",
    "https://fuse.drpc.org",
    "wss://fuse.drpc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Fuse",
    symbol: "FUSE",
    decimals: 18,
  },
  infoURL: "https://fuse.io/",
  chainId: 122,
  networkId: 122,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.fuse.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
