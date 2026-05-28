import type { Chain } from "../shared"

export const eip155_5589 = {
  name: "Jamton",
  shortName: "jamton",
  chain: "Jamton",
  icon: "jamton",
  rpc: ["https://rpc.jamton.network/"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "DOTON",
    symbol: "DOTON",
    decimals: 18,
  },
  infoURL: "https://app.jamton.network/",
  chainId: 5589,
  networkId: 5589,
  explorers: [],
} satisfies Chain
