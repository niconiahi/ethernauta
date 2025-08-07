// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_67588 = {
  name: "Cosmic Chain",
  shortName: "Cosmic",
  chain: "COSMIC",
  rpc: ["http://testnet.cosmicchain.site:3344"],
  faucets: [],
  nativeCurrency: {
    name: "Cosmic Chain",
    symbol: "COSMIC",
    decimals: 18,
  },
  infoURL: "https://cosmicchain.site",
  chainId: 67588,
  networkId: 3344,
} satisfies Chain
