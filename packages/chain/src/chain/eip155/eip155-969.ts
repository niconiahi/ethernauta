// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_969 = {
  name: "EthXY",
  shortName: "sexy",
  chain: "EthXY",
  icon: "sexy",
  rpc: ["https://rpc.ethxy.com"],
  faucets: [],
  nativeCurrency: {
    name: "Settled EthXY Token",
    symbol: "SEXY",
    decimals: 18,
  },
  infoURL: "https://ethxy.com",
  chainId: 969,
  networkId: 969,
  explorers: [
    {
      name: "EthXY Network Explorer",
      url: "https://explorer.ethxy.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
