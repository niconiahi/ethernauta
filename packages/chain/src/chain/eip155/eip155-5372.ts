// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5372 = {
  name: "Settlus Testnet",
  shortName: "settlus-testnet",
  chain: "Settlus",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Setl",
    symbol: "SETL",
    decimals: 18,
  },
  infoURL: "https://settlus.org",
  chainId: 5372,
  networkId: 5372,
  status: "deprecated",
} satisfies Chain
