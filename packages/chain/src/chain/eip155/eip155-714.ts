import type { Chain } from "../shared"

export const eip155_714 = {
  name: "Eden",
  shortName: "eden",
  chain: "Eden",
  icon: "eden",
  rpc: ["https://rpc.eden.gateway.fm"],
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
    name: "TIA",
    symbol: "TIA",
    decimals: 18,
  },
  infoURL: "https://celestia.org",
  chainId: 714,
  networkId: 714,
  explorers: [
    {
      name: "blockscout",
      url: "https://eden.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
