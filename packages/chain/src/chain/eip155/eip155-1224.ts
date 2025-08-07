// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1224 = {
  name: "Hybrid Testnet (Deprecated)",
  shortName: "hyb_deprecated",
  chain: "HYB",
  icon: "hybridIcon",
  rpc: ["https://testnet-rpc.buildonhybrid.com"],
  faucets: [],
  nativeCurrency: {
    name: "Hybrid",
    symbol: "HYB",
    decimals: 18,
  },
  infoURL: "https://buildonhybrid.com",
  chainId: 1224,
  networkId: 1224,
  explorers: [
    {
      name: "Hybrid Testnet",
      url: "https://explorer.buildonhybrid.com",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} satisfies Chain
