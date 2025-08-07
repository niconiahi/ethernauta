// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_163 = {
  name: "Lightstreams Mainnet",
  shortName: "pht",
  chain: "PHT",
  rpc: ["https://node.mainnet.lightstreams.io"],
  faucets: [],
  nativeCurrency: {
    name: "Lightstreams PHT",
    symbol: "PHT",
    decimals: 18,
  },
  infoURL: "https://explorer.lightstreams.io",
  chainId: 163,
  networkId: 163,
} satisfies Chain
