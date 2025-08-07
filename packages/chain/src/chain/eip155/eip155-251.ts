// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_251 = {
  name: "Glide L1 Protocol XP",
  shortName: "glide",
  chain: "GLXP",
  icon: "glide",
  rpc: [
    "https://rpc-api.glideprotocol.xyz/l1-rpc/",
    "wss://rpc-api.glideprotocol.xyz/l1-rpc/",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Glide XP",
    symbol: "GLXP",
    decimals: 18,
  },
  infoURL: "https://glideprotocol.xyz",
  chainId: 251,
  networkId: 251,
  slip44: 60,
  status: "active",
} satisfies Chain
