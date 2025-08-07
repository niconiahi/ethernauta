// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2662 = {
  name: "APEX",
  shortName: "apexmainnet",
  chain: "ETH",
  icon: "apexmainnet",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://apexlayer.xyz/",
  chainId: 2662,
  networkId: 2662,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
  status: "incubating",
} satisfies Chain
