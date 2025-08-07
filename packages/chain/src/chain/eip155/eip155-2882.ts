// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2882 = {
  name: "Chips Network",
  shortName: "chips",
  chain: "CHIPS",
  rpc: [
    "https://node.chips.ooo/wasp/api/v1/chains/iota1pp3d3mnap3ufmgqnjsnw344sqmf5svjh26y2khnmc89sv6788y3r207a8fn/evm",
  ],
  faucets: [],
  nativeCurrency: {
    name: "IOTA",
    symbol: "IOTA",
    decimals: 18,
  },
  infoURL: "https://www.chips.ooo",
  chainId: 2882,
  networkId: 2882,
} satisfies Chain
