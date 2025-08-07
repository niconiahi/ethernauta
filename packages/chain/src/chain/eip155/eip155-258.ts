// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_258 = {
  name: "Setheum",
  shortName: "setm",
  chain: "Setheum",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Setheum",
    symbol: "SETM",
    decimals: 18,
  },
  infoURL: "https://setheum.xyz",
  chainId: 258,
  networkId: 258,
} satisfies Chain
