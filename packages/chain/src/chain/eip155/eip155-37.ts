import type { Chain } from "../shared"

export const eip155_37 = {
  name: "CONX Chain",
  shortName: "conx",
  chain: "CONX",
  icon: "conx",
  rpc: ["https://dimension-evm-rpc.xpla.dev"],
  faucets: [],
  nativeCurrency: {
    name: "XPLA",
    symbol: "XPLA",
    decimals: 18,
  },
  infoURL: "https://conx.xyz",
  chainId: 37,
  networkId: 37,
  explorers: [
    {
      name: "CONX Explorer",
      url: "https://explorer.conx.xyz/mainnet",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
