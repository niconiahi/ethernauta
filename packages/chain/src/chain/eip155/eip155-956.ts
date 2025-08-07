// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_956 = {
  name: "muNode Testnet",
  shortName: "munode",
  chain: "munode",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://munode.dev/",
  chainId: 956,
  networkId: 956,
  slip44: 1,
} satisfies Chain
