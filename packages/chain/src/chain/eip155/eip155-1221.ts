// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1221 = {
  name: "Cycle Network Testnet",
  shortName: "Cycle",
  chain: "ETH",
  icon: "cycle",
  rpc: ["https://rpc-testnet.cyclenetwork.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.cyclenetwork.io/",
  chainId: 1221,
  networkId: 1221,
} satisfies Chain
