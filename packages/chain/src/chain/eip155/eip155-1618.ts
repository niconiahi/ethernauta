// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1618 = {
  name: "Catecoin Chain Mainnet",
  shortName: "cate",
  chain: "Catechain",
  rpc: ["https://send.catechain.com"],
  faucets: [],
  nativeCurrency: {
    name: "Catecoin",
    symbol: "CATE",
    decimals: 18,
  },
  infoURL: "https://catechain.com",
  chainId: 1618,
  networkId: 1618,
} satisfies Chain
