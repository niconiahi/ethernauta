// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_323 = {
  name: "BuyCex Infinity Chain",
  shortName: "buycex",
  chain: "BUYCEX",
  rpc: [
    "https://rpc.buycex.net",
    "wss://socket.buycex.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Buycex",
    symbol: "BCX",
    decimals: 18,
  },
  infoURL: "https://infinity.buycex.com",
  chainId: 323,
  networkId: 323,
  explorers: [
    {
      name: "Blockscout",
      url: "https://buycex.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
