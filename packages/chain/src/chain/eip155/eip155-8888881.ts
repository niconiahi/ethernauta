// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8888881 = {
  name: "Quarix Testnet",
  shortName: "quarix-testnet",
  chain: "Quarix",
  icon: "quarix",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "QARE",
    symbol: "QARE",
    decimals: 18,
  },
  infoURL: "",
  chainId: 8888881,
  networkId: 8888881,
  slip44: 1,
  explorers: [],
  status: "incubating",
} satisfies Chain
