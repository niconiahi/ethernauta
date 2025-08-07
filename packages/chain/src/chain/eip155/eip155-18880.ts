// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_18880 = {
  name: "EXPchain Testnet",
  shortName: "expchain",
  chain: "EXPCHAIN",
  icon: "expchain",
  rpc: ["https://rpc1-testnet.expchain.ai"],
  faucets: [],
  nativeCurrency: {
    name: "tZKJ",
    symbol: "tZKJ",
    decimals: 18,
  },
  infoURL: "https://expchain.ai",
  chainId: 18880,
  networkId: 18880,
  explorers: [
    {
      name: "EXPchain Testnet Explorer",
      url: "https://blockscout-testnet.expchain.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
