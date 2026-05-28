import type { Chain } from "../shared"

export const eip155_484 = {
  name: "Camp Network Mainnet",
  shortName: "CampMainnet",
  chain: "CAMP",
  icon: "camp",
  rpc: ["https://rpc.camp.raas.gelato.cloud"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Camp",
    symbol: "CAMP",
    decimals: 18,
  },
  infoURL: "https://docs.campnetwork.xyz",
  chainId: 484,
  networkId: 484,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://camp.cloud.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
