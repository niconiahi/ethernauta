// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1023 = {
  name: "Clover Testnet",
  shortName: "tclv",
  chain: "Clover",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Clover",
    symbol: "CLV",
    decimals: 18,
  },
  infoURL: "https://clover.finance",
  chainId: 1023,
  networkId: 1023,
  slip44: 1,
} satisfies Chain
