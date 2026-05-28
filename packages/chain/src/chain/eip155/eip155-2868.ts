import type { Chain } from "../shared"

export const eip155_2868 = {
  name: "HyperAGI Mainnet",
  shortName: "hypt",
  chain: "HyperAGI",
  icon: "hyperagi",
  rpc: [
    "https://rpc.hyperagi.network",
    "https://rpc.hyperagi.ai",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Hyperdust",
    symbol: "HYPT",
    decimals: 18,
  },
  infoURL: "https://www.hyperagi.ai",
  chainId: 2868,
  networkId: 2868,
  explorers: [
    {
      name: "hyperscan",
      url: "https://hyperscan.hyperagi.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
