import type { Chain } from "../shared"

export const eip155_3989 = {
  name: "Pione Trace Mainnet",
  shortName: "ptc",
  chain: "PTC",
  icon: "ptc",
  rpc: ["https://rpc.pionetrace.com"],
  faucets: [],
  nativeCurrency: {
    name: "Pione Trace",
    symbol: "PTC",
    decimals: 18,
  },
  infoURL: "https://pionetrace.com",
  chainId: 3989,
  networkId: 3989,
  explorers: [
    {
      name: "Pione Trace Explorer",
      url: "https://explorer.pionetrace.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
