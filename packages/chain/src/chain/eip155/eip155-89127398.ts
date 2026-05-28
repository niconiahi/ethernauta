import type { Chain } from "../shared"

export const eip155_89127398 = {
  name: "Krown Testnet",
  shortName: "krown-testnet",
  chain: "KROWN",
  icon: "krown",
  rpc: [
    "https://testnet.krown.network",
    "https://testnet1.krown.network",
  ],
  faucets: ["https://faucet.krown.network"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "KROWN",
    symbol: "KROWN",
    decimals: 18,
  },
  infoURL: "https://krown.network",
  chainId: 89127398,
  networkId: 89127398,
  explorers: [
    {
      name: "Krown Testnet Explorer",
      url: "https://explorer-testnet.krown.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
