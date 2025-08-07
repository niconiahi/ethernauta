// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3110 = {
  name: "SatoshiVM Testnet",
  shortName: "tSAVM",
  chain: "SatoshiVM",
  icon: "satoshivm",
  rpc: ["https://test-rpc-node-http.svmscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://www.satoshivm.io/",
  chainId: 3110,
  networkId: 3110,
} satisfies Chain
