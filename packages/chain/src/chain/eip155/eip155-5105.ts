// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5105 = {
  name: "Superloyalty Testnet",
  shortName: "superloyalty-testnet",
  chain: "Superloyalty Testnet",
  rpc: [
    "https://rpc-superloyalty-testnet-1m5gwjbsv1.t.conduit.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.superloyal.com/",
  chainId: 5105,
  networkId: 5105,
} satisfies Chain
