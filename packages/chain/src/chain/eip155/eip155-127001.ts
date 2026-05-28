import type { Chain } from "../shared"

export const eip155_127001 = {
  name: "Gravity",
  shortName: "grav",
  chain: "Gravity",
  icon: "gravity",
  rpc: ["https://mainnet-rpc.gravity.xyz"],
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
    name: "Gravity",
    symbol: "G",
    decimals: 18,
  },
  infoURL: "https://gravity.xyz",
  chainId: 127001,
  networkId: 127001,
  explorers: [
    {
      name: "Gravity Mainnet Explorer",
      url: "https://mainnet-explorer.gravity.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
