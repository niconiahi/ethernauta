// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_39797 = {
  name: "Energi Mainnet",
  shortName: "nrg",
  chain: "NRG",
  rpc: ["https://nodeapi.energi.network"],
  faucets: [],
  nativeCurrency: {
    name: "Energi",
    symbol: "NRG",
    decimals: 18,
  },
  infoURL: "https://www.energi.world/",
  chainId: 39797,
  networkId: 39797,
  slip44: 39797,
} satisfies Chain
