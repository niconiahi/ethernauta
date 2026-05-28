import type { Chain } from "../shared"

export const eip155_25821 = {
  name: "H2 Chain Testnet Lambda",
  shortName: "h2-lambda",
  chain: "H2",
  icon: "h2",
  rpc: ["https://rpc.h-1.io"],
  faucets: [],
  nativeCurrency: {
    name: "Lambda H2",
    symbol: "H2",
    decimals: 18,
  },
  infoURL: "https://h2chain.io",
  chainId: 25821,
  networkId: 25821,
  explorers: [
    {
      name: "h2scan-lambda",
      url: "https://lambda.h2scan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
