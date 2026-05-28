import type { Chain } from "../shared"

export const eip155_105105 = {
  name: "Xertra Mainnet",
  shortName: "xertra",
  chain: "Xertra",
  icon: "xertra",
  rpc: ["https://rpc.xertra.com"],
  faucets: [],
  nativeCurrency: {
    name: "STRAX",
    symbol: "STRAX",
    decimals: 18,
  },
  infoURL: "https://www.xertra.com/",
  chainId: 105105,
  networkId: 105105,
  explorers: [
    {
      name: "Xertra Explorer",
      url: "https://explorer.xertra.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
