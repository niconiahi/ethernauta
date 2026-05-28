import type { Chain } from "../shared"

export const eip155_375 = {
  name: "zkXPLA Mainnet",
  shortName: "zkxpla",
  chain: "zkXPLA",
  icon: "xpla",
  rpc: ["https://rpc.zkxpla.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://xpla.io",
  chainId: 375,
  networkId: 375,
  explorers: [
    {
      name: "zkXPLA Mainnet Explorer",
      url: "https://explorer.zkxpla.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
