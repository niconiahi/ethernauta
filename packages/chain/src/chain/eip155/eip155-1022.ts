// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1022 = {
  name: "Sakura",
  shortName: "sku",
  chain: "Sakura",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Sakura",
    symbol: "SKU",
    decimals: 18,
  },
  infoURL: "https://clover.finance/sakura",
  chainId: 1022,
  networkId: 1022,
} satisfies Chain
