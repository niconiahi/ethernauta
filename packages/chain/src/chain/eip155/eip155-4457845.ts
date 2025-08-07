// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4457845 = {
  name: "ZERO Testnet (Sepolia)",
  shortName: "zero-sepolia",
  chain: "ETH",
  icon: "zero-sepolia",
  rpc: ["https://rpc.zerion.io/v1/zero-sepolia"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.zero.network",
  chainId: 4457845,
  networkId: 4457845,
  slip44: 1,
  explorers: [
    {
      name: "ZERO Testnet Explorer",
      url: "https://explorer.zero.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge.zero.network",
      },
    ],
  },
} satisfies Chain
