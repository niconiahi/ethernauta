// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_46 = {
  name: "Darwinia Network",
  shortName: "darwinia",
  chain: "darwinia",
  rpc: [
    "https://rpc.darwinia.network",
    "https://darwinia-rpc.dcdao.box",
    "https://darwinia-rpc.dwellir.com",
    "https://darwinia.rpc.subquery.network/public",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Darwinia Network Native Token",
    symbol: "RING",
    decimals: 18,
  },
  infoURL: "https://darwinia.network",
  chainId: 46,
  networkId: 46,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.darwinia.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
