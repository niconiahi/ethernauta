// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_20250217 = {
  name: "Xphere Mainnet",
  shortName: "xp",
  chain: "Xphere",
  icon: "xphere",
  rpc: ["https://en-bkk.x-phere.com"],
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
    name: "Xphere",
    symbol: "XP",
    decimals: 18,
  },
  infoURL: "https://x-phere.com/",
  chainId: 20250217,
  networkId: 20250217,
  explorers: [
    {
      name: "Tamsa",
      url: "https://xp.tamsa.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
