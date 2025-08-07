// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_167008 = {
  name: "Taiko Katla L2",
  shortName: "tko-katla",
  chain: "ETH",
  icon: "taiko",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://taiko.xyz",
  chainId: 167008,
  networkId: 167008,
  explorers: [],
  status: "deprecated",
} satisfies Chain
