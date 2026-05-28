import type { Chain } from "../shared"

export const eip155_99110 = {
  name: "Dorsen Chain",
  shortName: "dorsen-test",
  chain: "Dorsen",
  icon: "dorsen",
  rpc: ["https://mainnet-rpc.dorsenscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "Dorsen Chain",
    symbol: "DC",
    decimals: 18,
  },
  infoURL: "https://docs.dorsenscan.io",
  chainId: 99110,
  networkId: 99110,
  explorers: [
    {
      name: "DorsenScan Mainnet",
      url: "https://dorsenscan.io",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
