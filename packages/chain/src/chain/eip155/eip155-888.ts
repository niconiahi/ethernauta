// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_888 = {
  name: "Wanchain",
  shortName: "wan",
  chain: "WAN",
  icon: "wanchain",
  rpc: ["https://gwan-ssl.wandevs.org:56891/"],
  faucets: [],
  nativeCurrency: {
    name: "Wancoin",
    symbol: "WAN",
    decimals: 18,
  },
  infoURL: "https://www.wanscan.org",
  chainId: 888,
  networkId: 888,
  slip44: 5718350,
  explorers: [
    {
      name: "wanscan",
      url: "https://wanscan.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
