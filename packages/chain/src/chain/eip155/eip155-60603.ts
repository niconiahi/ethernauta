import type { Chain } from "../shared"

export const eip155_60603 = {
  name: "POTOS Mainnet",
  shortName: "potos",
  chain: "POTOS",
  icon: "potos",
  rpc: ["https://rpc.potos.hk"],
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
    name: "POTOS Token",
    symbol: "POT",
    decimals: 18,
  },
  infoURL: "https://potos.hk",
  chainId: 60603,
  networkId: 60603,
  explorers: [
    {
      name: "POTOS Mainnet explorer",
      url: "https://scan.potos.hk",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
