import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_12611: Chain = {
  name: "Astar zkEVM",
  shortName: "astrzk",
  title: "Astar zkEVM Mainnet",
  chain: "ETH",
  icon: "astarzk",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://astar.network",
  chainId: 12611,
  networkId: 12611,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [],
  },
  status: "incubating",
}
