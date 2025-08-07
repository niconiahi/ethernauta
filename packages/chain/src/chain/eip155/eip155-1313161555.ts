// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1313161555 = {
  name: "Aurora Testnet",
  shortName: "aurora-testnet",
  chain: "NEAR",
  rpc: [
    "https://testnet.aurora.dev/",
    "https://aurora-testnet.drpc.org",
    "wss://aurora-testnet.drpc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://aurora.dev",
  chainId: 1313161555,
  networkId: 1313161555,
  slip44: 1,
  explorers: [
    {
      name: "Aurora Explorer",
      url: "https://explorer.testnet.aurora.dev",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
