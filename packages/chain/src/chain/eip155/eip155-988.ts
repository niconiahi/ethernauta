import type { Chain } from "../shared"

export const eip155_988 = {
  name: "Stable Mainnet",
  shortName: "stable",
  chain: "Stable",
  icon: "stable",
  rpc: ["https://rpc.stable.xyz"],
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
    name: "USDT0",
    symbol: "USDT0",
    decimals: 18,
  },
  infoURL: "https://stable.xyz",
  chainId: 988,
  networkId: 988,
  explorers: [
    {
      name: "Stablescan",
      url: "https://stablescan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
