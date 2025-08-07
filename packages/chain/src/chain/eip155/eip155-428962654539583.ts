// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_428962654539583 = {
  name: "Yominet",
  shortName: "yomi",
  chain: "YOMINET",
  icon: "yominet",
  rpc: [
    "https://jsonrpc-yominet-1.anvil.asia-southeast.initia.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.kamigotchi.io/",
  chainId: 428962654539583,
  networkId: 428962654539583,
  explorers: [],
} satisfies Chain
