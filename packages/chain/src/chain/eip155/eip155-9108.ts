// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9108 = {
  name: "Destra Dubai Testnet",
  shortName: "Destra",
  chain: "Destra",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Sync",
    symbol: "SYNC",
    decimals: 18,
  },
  infoURL: "",
  chainId: 9108,
  networkId: 9108,
  slip44: 1,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-4",
    bridges: [],
  },
  status: "active",
} satisfies Chain
