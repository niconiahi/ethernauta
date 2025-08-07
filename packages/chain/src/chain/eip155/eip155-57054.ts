// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_57054 = {
  name: "Sonic Blaze Testnet",
  shortName: "blaze",
  chain: "blaze-testnet",
  icon: "sonic",
  rpc: [
    "https://rpc.blaze.soniclabs.com",
    "https://sonic-blaze-rpc.publicnode.com",
    "wss://sonic-blaze-rpc.publicnode.com",
  ],
  faucets: ["https://blaze.soniclabs.com/account"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  infoURL: "https://blaze.soniclabs.com",
  chainId: 57054,
  networkId: 57054,
} satisfies Chain
