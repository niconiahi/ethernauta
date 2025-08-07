// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_984123 = {
  name: "Forma Sketchpad",
  shortName: "sketchpad",
  chain: "Forma",
  icon: "forma",
  rpc: ["https://rpc.sketchpad-1.forma.art"],
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
    name: "TIA",
    symbol: "TIA",
    decimals: 18,
  },
  infoURL: "https://forma.art",
  chainId: 984123,
  networkId: 984123,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.sketchpad-1.forma.art",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
