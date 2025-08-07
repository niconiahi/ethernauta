// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_534354 = {
  name: "Scroll Pre-Alpha Testnet",
  shortName: "scr-prealpha",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "TSETH",
    decimals: 18,
  },
  infoURL: "https://scroll.io",
  chainId: 534354,
  networkId: 534354,
  slip44: 1,
  explorers: [],
  status: "deprecated",
} satisfies Chain
