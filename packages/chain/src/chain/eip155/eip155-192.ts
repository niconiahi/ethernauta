import type { Chain } from "../shared"

export const eip155_192 = {
  name: "Redmansion Chain",
  shortName: "rmc",
  chain: "RMC",
  icon: "redmansion",
  rpc: ["https://redmansion.io/srpc/"],
  faucets: [],
  nativeCurrency: {
    name: "Redmansion Coin",
    symbol: "RMC",
    decimals: 18,
  },
  infoURL: "https://www.redmansion.io",
  chainId: 192,
  networkId: 192,
  explorers: [
    {
      name: "Redmansion explorer",
      url: "https://redmansion.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
