// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_97912060 = {
  name: "ChadChain",
  shortName: "chad",
  chain: "CHAD",
  rpc: ["https://rpc.chadchain.org"],
  faucets: [],
  nativeCurrency: {
    name: "ChadChain",
    symbol: "CHAD",
    decimals: 18,
  },
  infoURL: "https://chadchain.org",
  chainId: 97912060,
  networkId: 97912060,
  explorers: [],
  status: "incubating",
} satisfies Chain
