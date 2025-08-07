// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_28945486 = {
  name: "Auxilium Network Mainnet",
  shortName: "auxi",
  chain: "AUX",
  rpc: ["https://rpc.auxilium.global"],
  faucets: [],
  nativeCurrency: {
    name: "Auxilium coin",
    symbol: "AUX",
    decimals: 18,
  },
  infoURL: "https://auxilium.global",
  chainId: 28945486,
  networkId: 28945486,
  slip44: 344,
} satisfies Chain
