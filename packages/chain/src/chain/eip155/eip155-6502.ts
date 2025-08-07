// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6502 = {
  name: "Peerpay",
  shortName: "Peerpay",
  chain: "P2P",
  rpc: ["https://peerpay.su.gy/p2p"],
  faucets: [],
  nativeCurrency: {
    name: "Peerpay",
    symbol: "P2P",
    decimals: 18,
  },
  infoURL: "https://peerpay.su.gy",
  chainId: 6502,
  networkId: 6502,
  explorers: [],
} satisfies Chain
