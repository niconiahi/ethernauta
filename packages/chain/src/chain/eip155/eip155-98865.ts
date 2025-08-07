// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_98865 = {
  name: "Plume (Legacy)",
  shortName: "plume",
  title: "Plume Ethereum L2 Rollup Mainnet (Legacy)",
  chain: "PLUME Legacy",
  icon: "plume",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Plume Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://plume.org",
  chainId: 98865,
  networkId: 98865,
  slip44: 1,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
  status: "deprecated",
} satisfies Chain
