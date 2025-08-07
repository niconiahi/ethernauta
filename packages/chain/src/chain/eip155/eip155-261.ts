// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_261 = {
  name: "Guru Network Testnet",
  shortName: "tguru",
  chain: "tGURU",
  icon: "GuruNetwork",
  rpc: ["https://rpc-test.gurunetwork.ai"],
  faucets: ["https://v2.dex.guru/season-pass/faucet"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "testGURU",
    symbol: "tGURU",
    decimals: 18,
  },
  infoURL: "https://gurunetwork.ai",
  chainId: 261,
  networkId: 261,
  explorers: [
    {
      name: "guruscan",
      url: "https://sepolia.gurunetwork.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
