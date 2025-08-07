// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_18000 = {
  name: "Frontier of Dreams Testnet",
  shortName: "ZKST",
  chain: "Game Network",
  rpc: ["https://rpc.fod.games/"],
  faucets: [],
  nativeCurrency: {
    name: "ZKST",
    symbol: "ZKST",
    decimals: 18,
  },
  infoURL: "https://goexosphere.com",
  chainId: 18000,
  networkId: 18000,
  slip44: 1,
  explorers: [
    {
      name: "Game Network",
      url: "https://explorer.fod.games",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
