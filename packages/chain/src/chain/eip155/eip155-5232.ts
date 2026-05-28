import type { Chain } from "../shared"

export const eip155_5232 = {
  name: "LiterMark Chain",
  shortName: "lmk",
  chain: "LMK",
  icon: "litermark",
  rpc: ["https://litermark.org/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "LiterMark",
    symbol: "LMK",
    decimals: 18,
  },
  infoURL: "https://litermark.com",
  chainId: 5232,
  networkId: 5232,
  slip44: 60,
  explorers: [
    {
      name: "LMKscan",
      url: "https://litermark.org",
      standard: "none",
    },
  ],
  status: "active",
} satisfies Chain
