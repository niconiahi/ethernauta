import type { Chain } from "../shared"

export const eip155_2692 = {
  name: "Splendor Testnet",
  shortName: "spldt",
  chain: "SPLD-TESTNET",
  icon: "spld-testnet",
  rpc: ["https://testnet-rpc.splendor.org"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Splendor Test Token",
    symbol: "SPLDT",
    decimals: 18,
  },
  infoURL: "https://splendor.org",
  chainId: 2692,
  networkId: 2692,
  explorers: [
    {
      name: "Splendor Testnet Explorer",
      url: "https://testnet-explorer.splendor.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
