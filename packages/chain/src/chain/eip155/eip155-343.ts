import type { Chain } from "../shared"

export const eip155_343 = {
  name: "Capital Exchange SE",
  shortName: "bourse",
  chain: "BOURSE",
  icon: "bourse",
  rpc: ["https://rpc.capitalexchange.digital"],
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
    name: "Bourse",
    symbol: "BOURSE",
    decimals: 18,
  },
  infoURL: "https://www.capitalexchange.markets",
  chainId: 343,
  networkId: 343,
  explorers: [
    {
      name: "Capital Exchange Markets | Digital",
      url: "https://explorer.capitalexchange.se",
      standard: "none",
    },
  ],
} satisfies Chain
