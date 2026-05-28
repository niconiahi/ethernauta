import type { Chain } from "../shared"

export const eip155_179170 = {
  name: "Transparency Solution",
  shortName: "clts",
  chain: "CLT",
  icon: "transparencysolution",
  rpc: ["https://rpc-api.transparency.solutions"],
  faucets: [],
  nativeCurrency: {
    name: "ClearToken",
    symbol: "CLT",
    decimals: 18,
  },
  infoURL: "https://transparency.solutions",
  chainId: 179170,
  networkId: 179170,
  explorers: [
    {
      name: "Transparency Solution Explorer",
      url: "https://blockchain.transparency.solutions",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
