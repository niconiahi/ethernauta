// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_977 = {
  name: "Nepal Blockchain Network",
  shortName: "yeti",
  chain: "YETI",
  rpc: [
    "https://api.nepalblockchain.dev",
    "https://api.nepalblockchain.network",
  ],
  faucets: ["https://faucet.nepalblockchain.network"],
  nativeCurrency: {
    name: "Nepal Blockchain Network Ether",
    symbol: "YETI",
    decimals: 18,
  },
  infoURL: "https://nepalblockchain.network",
  chainId: 977,
  networkId: 977,
} satisfies Chain
