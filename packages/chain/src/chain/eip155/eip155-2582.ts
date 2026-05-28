import type { Chain } from "../shared"

export const eip155_2582 = {
  name: "H2 Chain Mainnet",
  shortName: "h2",
  chain: "H2",
  icon: "h2",
  rpc: ["https://rpc.h2chain.io"],
  faucets: [],
  nativeCurrency: {
    name: "H2 Chain Native Token",
    symbol: "H2",
    decimals: 18,
  },
  infoURL: "https://h2chain.io",
  chainId: 2582,
  networkId: 2582,
  explorers: [
    {
      name: "h2scan",
      url: "https://h2scan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
