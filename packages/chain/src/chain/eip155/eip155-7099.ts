// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7099 = {
  name: "Bharat Blockchain Network",
  shortName: "bbnt",
  chain: "BBNT",
  rpc: ["https://bbnrpc.testnet.bharatblockchain.io"],
  faucets: ["https://www.bon.bharatblockchain.io/faucet"],
  features: [],
  nativeCurrency: {
    name: "BBNT",
    symbol: "BBN",
    decimals: 18,
  },
  infoURL: "https://bharatblockchain.io/",
  chainId: 7099,
  networkId: 7099,
  explorers: [],
} satisfies Chain
