// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1286 = {
  name: "Moonrock old",
  shortName: "mrock-old",
  chain: "MOON",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Rocs",
    symbol: "ROC",
    decimals: 18,
  },
  infoURL: "",
  chainId: 1286,
  networkId: 1286,
  status: "deprecated",
} satisfies Chain
