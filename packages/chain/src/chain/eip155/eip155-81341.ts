// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_81341 = {
  name: "Amana Testnet",
  shortName: "amanatest",
  chain: "MEER",
  icon: "meer",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Amana Testnet",
    symbol: "MEER-T",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 81341,
  networkId: 81341,
  slip44: 1,
  status: "incubating",
} satisfies Chain
