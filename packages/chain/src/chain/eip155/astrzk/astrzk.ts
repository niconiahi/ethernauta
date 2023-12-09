/* eslint no-template-curly-in-string: 0 */
export const astrzk = {
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
} as const