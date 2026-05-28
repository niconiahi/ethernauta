import type { Chain } from "../shared"

export const eip155_2255 = {
  name: "ClubMOS",
  shortName: "CMX",
  chain: "CMX",
  icon: "mos",
  rpc: ["https://rpc.mosscan.com"],
  faucets: ["https://faucet.clubmos.com"],
  nativeCurrency: {
    name: "ClubMOS",
    symbol: "CMX",
    decimals: 18,
  },
  infoURL: "https://www.clubmos.com",
  chainId: 2255,
  networkId: 2255,
  explorers: [
    {
      name: "mosscan",
      url: "https://mosscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
