// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4062 = {
  name: "Nahmii 3 Testnet",
  shortName: "Nahmii3Testnet",
  chain: "Nahmii",
  icon: "nahmii",
  rpc: ["https://rpc.testnet.nahmii.io"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://nahmii.io",
  chainId: 4062,
  networkId: 4062,
  slip44: 1,
  explorers: [
    {
      name: "Nahmii 3 Testnet Explorer",
      url: "https://explorer.testnet.nahmii.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://accounts.testnet.nahmii.io",
      },
    ],
  },
  status: "active",
} satisfies Chain
