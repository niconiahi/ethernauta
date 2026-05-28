import type { Chain } from "../shared"

export const eip155_250611 = {
  name: "StreamChain",
  shortName: "stc",
  chain: "STC",
  icon: "streamchain",
  rpc: ["https://rpc.strmchain.com"],
  faucets: [],
  nativeCurrency: {
    name: "StreamChain",
    symbol: "STC",
    decimals: 18,
  },
  infoURL: "https://strmchain.com",
  chainId: 250611,
  networkId: 250611,
  explorers: [
    {
      name: "StreamChain Explorer",
      url: "https://explorer.strmchain.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
