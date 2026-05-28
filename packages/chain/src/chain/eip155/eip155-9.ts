import type { Chain } from "../shared"

export const eip155_9 = {
  name: "Quai Network Mainnet",
  shortName: "quai",
  chain: "QUAI",
  icon: "quai",
  rpc: ["https://rpc.quai.network/cyprus1"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Quai",
    symbol: "QUAI",
    decimals: 18,
  },
  infoURL: "https://qu.ai",
  chainId: 9,
  networkId: 9,
  explorers: [
    {
      name: "Quaiscan",
      url: "https://quaiscan.io",
      standard: "EIP3091",
    },
  ],
  redFlags: ["reusedChainId"],
} satisfies Chain
