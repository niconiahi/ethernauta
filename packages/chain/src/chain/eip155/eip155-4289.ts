import type { Chain } from "../shared"

export const eip155_4289 = {
  name: "TPIX Chain",
  shortName: "tpix",
  chain: "TPIX",
  icon: "tpix",
  rpc: ["https://rpc.tpix.online"],
  faucets: [],
  nativeCurrency: {
    name: "Thaiprompt Index",
    symbol: "TPIX",
    decimals: 18,
  },
  infoURL: "https://tpix.online",
  chainId: 4289,
  networkId: 4289,
  explorers: [
    {
      name: "TPIX Chain Explorer",
      url: "https://explorer.tpix.online",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
