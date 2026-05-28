import type { Chain } from "../shared"

export const eip155_153871 = {
  name: "Orqus Testnet",
  shortName: "orqus-testnet",
  chain: "Orqus",
  rpc: ["https://rpc-test.orqus.io"],
  faucets: [],
  nativeCurrency: {
    name: "No native currency",
    symbol: "USD",
    decimals: 18,
  },
  infoURL: "https://orqus.io",
  chainId: 153871,
  networkId: 153871,
  explorers: [
    {
      name: "Orquscan",
      url: "https://orquscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
