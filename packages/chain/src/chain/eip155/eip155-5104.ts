// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5104 = {
  name: "Charmverse Testnet",
  shortName: "charmverse-testnet",
  chain: "Charmverse Testnet",
  rpc: [
    "https://rpc-charmverse-testnet-g6blnaebes.t.conduit.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://charmverse.io/",
  chainId: 5104,
  networkId: 5104,
} satisfies Chain
