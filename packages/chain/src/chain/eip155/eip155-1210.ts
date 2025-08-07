// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1210 = {
  name: "Cuckoo Sepolia",
  shortName: "caisepolia",
  title: "Cuckoo AI Testnet Sepolia",
  chain: "CuckooAI",
  rpc: [
    "https://testnet-rpc.cuckoo.network",
    "wss://testnet-rpc.cuckoo.network",
  ],
  faucets: ["https://cuckoo.network/portal/faucet/"],
  nativeCurrency: {
    name: "CuckooAI",
    symbol: "CAI",
    decimals: 18,
  },
  infoURL: "https://cuckoo.network",
  chainId: 1210,
  networkId: 1210,
  explorers: [],
} satisfies Chain
