// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19527 = {
  name: "Magnet Network",
  shortName: "mgt",
  chain: "Magnet",
  rpc: ["https://magnet-rpc.magport.io/"],
  faucets: [],
  nativeCurrency: {
    name: "Magnet Network",
    symbol: "DOT",
    decimals: 18,
  },
  infoURL: "https://magnet.magport.io/",
  chainId: 19527,
  networkId: 19527,
  explorers: [],
} satisfies Chain
