import type { Chain } from "../shared"

export const eip155_5031 = {
  name: "Somnia Mainnet",
  shortName: "SomniaMainnet",
  chain: "Somnia",
  rpc: ["https://api.infra.mainnet.somnia.network"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Somnia Mainnet",
    symbol: "SOMI",
    decimals: 18,
  },
  infoURL: "https://somnia.network",
  chainId: 5031,
  networkId: 5031,
  explorers: [
    {
      name: "Somnia Mainnet",
      url: "https://mainnet.somnia.w3us.site",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
