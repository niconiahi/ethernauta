import type { Chain } from "../shared"

export const eip155_19998 = {
  name: "SuperAIChain Mainnet",
  shortName: "sup",
  chain: "SuperAIChain",
  icon: "superaichain",
  rpc: ["https://rpc.superaichain.ai"],
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
    name: "SUP",
    symbol: "SUP",
    decimals: 18,
  },
  infoURL: "https://superaichain.ai",
  chainId: 19998,
  networkId: 19998,
  slip44: 60,
  explorers: [
    {
      name: "SuperAIChain Explorer",
      url: "https://scan.superaichain.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
