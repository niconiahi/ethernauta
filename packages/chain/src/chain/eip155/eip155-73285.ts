import type { Chain } from "../shared"

export const eip155_73285 = {
  name: "Nebula",
  shortName: "nebula",
  chain: "NEBULA",
  icon: "nebula",
  rpc: ["https://nebula-chain.com/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Nebula Cash",
    symbol: "NEBX",
    decimals: 18,
  },
  infoURL: "https://nebula-chain.com",
  chainId: 73285,
  networkId: 73285,
  explorers: [
    {
      name: "Nebula Explorer",
      url: "https://nebxscan.nebula-chain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
