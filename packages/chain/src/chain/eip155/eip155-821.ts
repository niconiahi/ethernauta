// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_821 = {
  name: "Callisto Testnet Deprecated",
  shortName: "tclo",
  chain: "CLO",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Callisto Testnet Ether",
    symbol: "TCLO",
    decimals: 18,
  },
  infoURL: "https://callisto.network",
  chainId: 821,
  networkId: 2,
  slip44: 1,
  status: "deprecated",
} satisfies Chain
