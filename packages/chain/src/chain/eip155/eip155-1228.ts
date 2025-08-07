// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1228 = {
  name: "Cycle Network Testnet Cuttlefish",
  shortName: "cyclec",
  chain: "ETH",
  icon: "cycle",
  rpc: ["https://cuttlefish-rpc-testnet.cyclenetwork.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.cyclenetwork.io/",
  chainId: 1228,
  networkId: 1228,
} satisfies Chain
