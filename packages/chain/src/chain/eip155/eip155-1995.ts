// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1995 = {
  name: "edeXa Testnet",
  shortName: "edxt",
  chain: "edeXa",
  icon: "edexa",
  rpc: [
    "https://rpc.testnet.edexa.network",
    "https://rpc.testnet.edexa.com",
  ],
  faucets: ["https://faucet.edexa.com/"],
  nativeCurrency: {
    name: "edeXa",
    symbol: "tEDX",
    decimals: 18,
  },
  infoURL: "https://edexa.network/",
  chainId: 1995,
  networkId: 1995,
  slip44: 1,
  explorers: [
    {
      name: "edexa-testnet-explorer",
      url: "https://explorer.testnet.edexa.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
