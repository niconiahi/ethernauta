// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_90354 = {
  name: "Camp Testnet",
  shortName: "camp",
  chain: "ETH",
  icon: "camp",
  rpc: [
    "https://rpc-camp-network-4xje7wy105.t.conduit.xyz",
  ],
  faucets: ["https://www.campnetwork.xyz/faucet"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://campaign-1.gitbook.io/camp-technical-docså",
  chainId: 90354,
  networkId: 90354,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorerl2new-camp-network-4xje7wy105.t.conduit.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://camp-testnet-bridge.vercel.app/",
      },
    ],
  },
} satisfies Chain
