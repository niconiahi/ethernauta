// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5103 = {
  name: "Coordinape Testnet",
  shortName: "coordinape-testnet",
  chain: "Coordinape Testnet",
  rpc: [
    "https://rpc-coordinape-testnet-vs9se3oc4v.t.conduit.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://coordinape.com/",
  chainId: 5103,
  networkId: 5103,
} satisfies Chain
