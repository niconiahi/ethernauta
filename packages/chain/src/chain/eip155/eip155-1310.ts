// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1310 = {
  name: "COINZAX",
  shortName: "zax",
  chain: "ZAX",
  icon: "coinzaxIcon",
  rpc: ["https://rpc.coinzax.com"],
  faucets: [],
  nativeCurrency: {
    name: "COINZAX",
    symbol: "ZAX",
    decimals: 18,
  },
  infoURL: "https://coinzax.com",
  chainId: 1310,
  networkId: 1310,
  explorers: [
    {
      name: "COINZAX Explorer",
      url: "https://explorer.coinzax.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
