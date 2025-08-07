// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_81361 = {
  name: "Mizana Testnet",
  shortName: "mizanatest",
  chain: "MEER",
  icon: "meer",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Mizana Testnet",
    symbol: "MEER-T",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 81361,
  networkId: 81361,
  slip44: 1,
  status: "incubating",
} satisfies Chain
