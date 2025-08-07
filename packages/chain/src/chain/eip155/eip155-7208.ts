// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7208 = {
  name: "Nexera Mainnet",
  shortName: "nxra-mainnet",
  chain: "Nexera",
  rpc: ["https://rpc.nexera.network"],
  faucets: [],
  nativeCurrency: {
    name: "NXRA",
    symbol: "NXRA",
    decimals: 18,
  },
  infoURL: "https://nexera.network",
  chainId: 7208,
  networkId: 7208,
  explorers: [],
} satisfies Chain
