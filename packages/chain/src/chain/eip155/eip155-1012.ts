// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1012 = {
  name: "Newton",
  shortName: "new",
  chain: "NEW",
  rpc: ["https://global.rpc.mainnet.newtonproject.org"],
  faucets: [],
  nativeCurrency: {
    name: "Newton",
    symbol: "NEW",
    decimals: 18,
  },
  infoURL: "https://www.newtonproject.org/",
  chainId: 1012,
  networkId: 1012,
} satisfies Chain
