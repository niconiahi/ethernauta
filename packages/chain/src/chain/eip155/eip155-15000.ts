import type { Chain } from "../shared"

export const eip155_15000 = {
  name: "Quai Network Testnet",
  shortName: "quai-testnet",
  chain: "QUAI",
  icon: "quai",
  rpc: ["https://orchard.rpc.quai.network/cyprus1"],
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
  chainId: 15000,
  networkId: 15000,
  explorers: [
    {
      name: "Orchard Quaiscan",
      url: "https://orchard.quaiscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
