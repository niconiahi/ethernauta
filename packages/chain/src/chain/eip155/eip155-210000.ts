import type { Chain } from "../shared"

export const eip155_210000 = {
  name: "JuChain Mainnet",
  shortName: "ju",
  chain: "JuChain",
  icon: "ju",
  rpc: ["https://rpc.juchain.org", "wss://ws.juchain.org"],
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
    name: "JU",
    symbol: "JU",
    decimals: 18,
  },
  infoURL: "https://www.juchain.org",
  chainId: 210000,
  networkId: 210000,
  explorers: [
    {
      name: "JUChain Mainnet Explorer",
      url: "https://juscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
