// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_28882 = {
  name: "Boba Sepolia",
  shortName: "BobaSepolia",
  chain: "ETH",
  rpc: [
    "https://sepolia.boba.network",
    "https://boba-sepolia.gateway.tenderly.co",
    "https://gateway.tenderly.co/public/boba-sepolia",
    "wss://boba-sepolia.gateway.tenderly.co/",
    "wss://gateway.tenderly.co/public/boba-sepolia",
  ],
  faucets: ["https://www.l2faucet.com/boba"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://boba.network",
  chainId: 28882,
  networkId: 28882,
  explorers: [
    {
      name: "Routescan",
      url: "https://testnet.bobascan.com",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [],
  },
} satisfies Chain
