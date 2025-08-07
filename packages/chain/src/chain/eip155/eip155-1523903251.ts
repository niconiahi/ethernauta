// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1523903251 = {
  name: "Haust Network Testnet",
  shortName: "HaustTestnet",
  title: "Haust Network Testnet",
  chain: "haust-network-testnet",
  icon: "haust",
  rpc: ["https://rpc-testnet.haust.app"],
  faucets: ["https://faucet.haust.app"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "HAUST",
    symbol: "HAUST",
    decimals: 18,
  },
  infoURL: "https://haust.network/",
  chainId: 1523903251,
  networkId: 1523903251,
  explorers: [
    {
      name: "Haust Network Testnet Explorer",
      url: "https://explorer-testnet.haust.app",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge-testnet.haust.app",
      },
    ],
  },
  status: "active",
} satisfies Chain
