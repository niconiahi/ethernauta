// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_495 = {
  name: "Landstars",
  shortName: "lds",
  chain: "Landstars",
  icon: "landstars",
  rpc: ["https://13882-60301.pph-server.de"],
  faucets: [],
  nativeCurrency: {
    name: "Landstars",
    symbol: "LDS",
    decimals: 18,
  },
  infoURL: "https://github.com/khalikov001/landstars-info",
  chainId: 495,
  networkId: 495,
  explorers: [],
} satisfies Chain
