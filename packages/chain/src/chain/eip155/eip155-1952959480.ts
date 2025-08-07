// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1952959480 = {
  name: "Lumia Testnet",
  shortName: "lumiatestnet",
  title: "Lumia Testnet",
  chain: "ETH",
  icon: "lumia",
  rpc: ["https://testnet-rpc.lumia.org"],
  faucets: ["https://testnet-faucet.lumia.org"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Lumia",
    symbol: "LUMIA",
    decimals: 18,
  },
  infoURL: "https://lumia.org",
  chainId: 1952959480,
  networkId: 1952959480,
  explorers: [
    {
      name: "Lumia Testnet Explorer",
      url: "https://testnet-explorer.lumia.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://testnet-bridge.lumia.org",
      },
    ],
  },
} satisfies Chain
