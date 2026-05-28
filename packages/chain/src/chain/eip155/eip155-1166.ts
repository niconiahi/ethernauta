import type { Chain } from "../shared"

export const eip155_1166 = {
  name: "ClubMOS Testnet",
  shortName: "tCMX",
  chain: "tCMX",
  icon: "mos",
  rpc: ["https://rpc-testnet.mosscan.com"],
  faucets: ["https://faucet.clubmos.com"],
  nativeCurrency: {
    name: "ClubMOS",
    symbol: "tCMX",
    decimals: 18,
  },
  infoURL: "https://www.clubmos.com",
  chainId: 1166,
  networkId: 1166,
  explorers: [
    {
      name: "mosscan",
      url: "https://testnet.mosscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
