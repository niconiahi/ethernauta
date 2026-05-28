import type { Chain } from "../shared"

export const eip155_9922 = {
  name: "JingleX L2",
  shortName: "jnx",
  chain: "JNX",
  icon: "jinglex",
  rpc: ["https://rpc.jinglex.net"],
  faucets: ["https://jinglex.net/faucet"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "JingleX",
    symbol: "JNX",
    decimals: 18,
  },
  infoURL: "https://jinglex.net",
  chainId: 9922,
  networkId: 9922,
  slip44: 60,
  explorers: [
    {
      name: "JingleX Explorer",
      url: "https://jinglex.net/explorer",
      standard: "none",
    },
  ],
} satisfies Chain
