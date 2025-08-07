// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_27483 = {
  name: "Nanon Sepolia",
  shortName: "Nanon-Testnet",
  title: "Nanon Sepolia Rollup Testnet",
  chain: "ETH",
  icon: "nanon",
  rpc: ["https://sepolia-rpc.nanon.network"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.nanon.network",
  chainId: 27483,
  networkId: 27483,
  slip44: 1,
  explorers: [
    {
      name: "Nanon Sepolia Rollup Testnet Explorer",
      url: "https://sepolia-explorer.nanon.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://sepolia-bridge.nanon.network",
      },
    ],
  },
} satisfies Chain
