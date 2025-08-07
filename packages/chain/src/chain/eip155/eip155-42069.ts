// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_42069 = {
  name: "pegglecoin",
  shortName: "PC",
  chain: "42069",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "pegglecoin",
    symbol: "peggle",
    decimals: 18,
  },
  infoURL: "https://teampeggle.com",
  chainId: 42069,
  networkId: 42069,
} satisfies Chain
