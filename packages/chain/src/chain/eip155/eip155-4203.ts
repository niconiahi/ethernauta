// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4203 = {
  name: "Merlin Erigon Testnet",
  shortName: "Merlin-Testnet",
  title: "Merlin Erigon Testnet",
  chain: "Merlin",
  icon: "merlin",
  rpc: ["https://testnet-erigon-rpc.merlinchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://merlinchain.io",
  chainId: 4203,
  networkId: 4203,
  explorers: [
    {
      name: "L2scan",
      url: "https://testnet-erigon-scan.merlinchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
