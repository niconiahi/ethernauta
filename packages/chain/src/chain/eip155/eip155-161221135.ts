// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_161221135 = {
  name: "Plume Testnet (Legacy)",
  shortName: "plume-testnet-legacy",
  title: "Plume Sepolia L2 Rollup Testnet (Legacy)",
  chain: "PLUME Testnet Legacy",
  icon: "plume",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Plume Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://plume.org",
  chainId: 161221135,
  networkId: 161221135,
  slip44: 1,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
  status: "deprecated",
} satisfies Chain
