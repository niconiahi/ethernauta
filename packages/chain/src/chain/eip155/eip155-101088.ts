// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_101088 = {
  name: "Xitcoin",
  shortName: "Xitcoin",
  chain: "XITCOIN",
  icon: "xitcoin",
  rpc: ["https://network.xitcoin.org"],
  faucets: [],
  nativeCurrency: {
    name: "Xitcoin",
    symbol: "$XTC",
    decimals: 8,
  },
  infoURL: "https://docs.xitcoin.org/",
  chainId: 101088,
  networkId: 101088,
  explorers: [],
} satisfies Chain
