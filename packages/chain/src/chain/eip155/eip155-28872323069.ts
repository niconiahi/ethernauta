// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_28872323069 = {
  name: "GitSwarm Test Network",
  shortName: "GS-ETH",
  title: "GitSwarm Test Network",
  chain: "ETH",
  icon: "gitswarm",
  rpc: ["https://testnet.gitswarm.com:2096"],
  faucets: [],
  nativeCurrency: {
    name: "GitSwarm Ether",
    symbol: "GS-ETH",
    decimals: 18,
  },
  infoURL: "https://gitswarm.com/",
  chainId: 28872323069,
  networkId: 28872323069,
  slip44: 1,
  explorers: [],
  status: "incubating",
} satisfies Chain
