// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_98867 = {
  name: "Plume Testnet",
  shortName: "plume-testnet",
  title: "Plume Sepolia L2 Rollup Testnet",
  chain: "PLUME Testnet",
  icon: "plume",
  rpc: [
    "https://testnet-rpc.plume.org",
    "wss://testnet-rpc.plume.org",
  ],
  faucets: ["https://faucet.plume.org"],
  nativeCurrency: {
    name: "Plume",
    symbol: "PLUME",
    decimals: 18,
  },
  infoURL: "https://plume.org",
  chainId: 98867,
  networkId: 98867,
  slip44: 1,
  explorers: [
    {
      name: "Blockscout",
      url: "https://testnet-explorer.plume.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://testnet-bridge.plume.org",
      },
    ],
  },
  status: "active",
} satisfies Chain
