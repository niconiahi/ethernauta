// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2030232745 = {
  name: "Lumia Beam Testnet",
  shortName: "lumia-beam-testnet",
  title: "Lumia Beam Testnet",
  chain: "ETH",
  icon: "lumia",
  rpc: ["https://beam-rpc.lumia.org"],
  faucets: ["https://beam-faucet.lumia.org/"],
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
  chainId: 2030232745,
  networkId: 2030232745,
  explorers: [
    {
      name: "Lumia Beam Testnet Explorer",
      url: "https://beam-explorer.lumia.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://beam-bridge.lumia.org",
      },
    ],
  },
} satisfies Chain
