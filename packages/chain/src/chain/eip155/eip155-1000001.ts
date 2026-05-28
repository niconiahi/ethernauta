import type { Chain } from "../shared"

export const eip155_1000001 = {
  name: "WebChain ETK",
  shortName: "wvm",
  chain: "WVM",
  icon: "webchain",
  rpc: ["https://rpc.webchain.e-talk.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "ETK",
    symbol: "ETK",
    decimals: 18,
  },
  infoURL: "https://e-talk.xyz/webchain",
  chainId: 1000001,
  networkId: 1000001,
  explorers: [
    {
      name: "WebChain Explorer",
      url: "https://e-talk.xyz/webchain",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
