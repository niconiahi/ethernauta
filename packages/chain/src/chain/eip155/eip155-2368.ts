// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2368 = {
  name: "KiteAI Testnet",
  shortName: "KiteAI",
  chain: "KiteAI",
  icon: "kite",
  rpc: ["https://rpc-testnet.gokite.ai"],
  faucets: ["https://faucet.gokite.ai/"],
  nativeCurrency: {
    name: "Kite",
    symbol: "KITE",
    decimals: 18,
  },
  infoURL: "https://gokite.ai/",
  chainId: 2368,
  networkId: 1,
  slip44: 1,
  explorers: [
    {
      name: "Kitescan",
      url: "https://testnet.kitescan.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
