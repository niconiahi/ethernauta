// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_32 = {
  name: "GoodData Testnet",
  shortName: "GooDT",
  chain: "GooD",
  rpc: ["https://test2.goodata.io"],
  faucets: [],
  nativeCurrency: {
    name: "GoodData Testnet Ether",
    symbol: "GooD",
    decimals: 18,
  },
  infoURL: "https://www.goodata.org",
  chainId: 32,
  networkId: 32,
  slip44: 1,
} satisfies Chain
