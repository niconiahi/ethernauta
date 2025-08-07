// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_260 = {
  name: "Guru Network",
  shortName: "guru",
  chain: "GURU",
  icon: "GuruNetwork",
  rpc: ["https://rpc-main.gurunetwork.ai"],
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
    name: "Guru",
    symbol: "GURU",
    decimals: 18,
  },
  infoURL: "https://gurunetwork.ai",
  chainId: 260,
  networkId: 260,
  explorers: [
    {
      name: "guruscan",
      url: "https://scan.gurunetwork.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
