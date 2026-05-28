import type { Chain } from "../shared"

export const eip155_9745 = {
  name: "Plasma Mainnet",
  shortName: "plasma",
  chain: "Plasma",
  icon: "plasma",
  rpc: ["https://rpc.plasma.to"],
  faucets: [],
  nativeCurrency: {
    name: "Plasma",
    symbol: "XPL",
    decimals: 18,
  },
  infoURL: "https://plasma.to",
  chainId: 9745,
  networkId: 9745,
  explorers: [
    {
      name: "Routescan",
      url: "https://plasmascan.to",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
