// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19224 = {
  name: "Decentraconnect Social",
  shortName: "DCSMs",
  chain: "DCSM",
  icon: "dcsmIcon",
  rpc: ["https://rpc.decentraconnect.io"],
  faucets: [],
  nativeCurrency: {
    name: "Decentraconnect Social",
    symbol: "DCSM",
    decimals: 18,
  },
  infoURL: "https://docs.decentraconnect.io",
  chainId: 19224,
  networkId: 19224,
  explorers: [
    {
      name: "Decentraconnect Social",
      url: "https://decentraconnect.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
