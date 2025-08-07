// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8889 = {
  name: "Vyvo Smart Chain",
  shortName: "vsc",
  chain: "VSC",
  rpc: ["https://vsc-dataseed.vyvo.org:8889"],
  faucets: [],
  nativeCurrency: {
    name: "VSC",
    symbol: "VSC",
    decimals: 18,
  },
  infoURL: "https://vsc-dataseed.vyvo.org",
  chainId: 8889,
  networkId: 8889,
} satisfies Chain
