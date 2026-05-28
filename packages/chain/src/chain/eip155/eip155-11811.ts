import type { Chain } from "../shared"

export const eip155_11811 = {
  name: "ARK Mainnet",
  shortName: "ark",
  chain: "ARK",
  icon: "ark",
  rpc: ["https://rpc.ark.io"],
  faucets: [],
  nativeCurrency: {
    name: "ARK Token",
    symbol: "ARK",
    decimals: 18,
  },
  infoURL: "https://ark.io",
  chainId: 11811,
  networkId: 11811,
  slip44: 60,
  explorers: [
    {
      name: "ARK Mainnet Explorer",
      url: "https://arkscan.io",
      standard: "none",
    },
  ],
  status: "incubating",
} satisfies Chain
