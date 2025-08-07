// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_252 = {
  name: "Fraxtal",
  shortName: "frax",
  chain: "FRAX",
  icon: "fraxtal",
  rpc: [
    "https://rpc.frax.com",
    "https://fraxtal-rpc.publicnode.com",
    "wss://fraxtal-rpc.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Frax",
    symbol: "FRAX",
    decimals: 18,
  },
  infoURL: "https://mainnet.frax.com",
  chainId: 252,
  networkId: 252,
  explorers: [
    {
      name: "fraxscan",
      url: "https://fraxscan.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
