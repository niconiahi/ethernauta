// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_81351 = {
  name: "Flana Testnet",
  shortName: "flanatest",
  chain: "MEER",
  icon: "meer",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Flana Testnet",
    symbol: "MEER-T",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 81351,
  networkId: 81351,
  slip44: 1,
  status: "incubating",
} satisfies Chain
