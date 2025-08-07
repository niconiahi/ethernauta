// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1414 = {
  name: "Silicon zkEVM Sepolia Testnet(Deprecated)",
  shortName: "silicon-sepolia-testnet-deprecated",
  title: "Silicon zkEVM Sepolia Testnet(Deprecated)",
  chain: "Silicon",
  icon: "silicon",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 1414,
  networkId: 1414,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [],
  },
  status: "deprecated",
} satisfies Chain
