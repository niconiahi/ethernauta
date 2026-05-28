import type { Chain } from "../shared"

export const eip155_475 = {
  name: "zkXPLA Testnet",
  shortName: "zkxpla-testnet",
  chain: "zkXPLA",
  icon: "xpla",
  rpc: ["https://testnet-rpc.zkxpla.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://xpla.io",
  chainId: 475,
  networkId: 475,
  explorers: [
    {
      name: "zkXPLA Testnet Explorer",
      url: "https://testnet-explorer.zkxpla.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
