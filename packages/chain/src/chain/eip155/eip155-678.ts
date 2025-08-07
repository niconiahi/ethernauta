// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_678 = {
  name: "Janction",
  shortName: "janction",
  chain: "Janction",
  icon: "janction",
  rpc: ["https://rpc.janction.io", "wss://rpc.janction.io"],
  faucets: [],
  nativeCurrency: {
    name: "Janction",
    symbol: "JCT",
    decimals: 18,
  },
  infoURL: "https://janction.io",
  chainId: 678,
  networkId: 678,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [],
  },
} satisfies Chain
