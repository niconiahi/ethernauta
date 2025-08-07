// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1313161560 = {
  name: "PowerGold",
  shortName: "powergold",
  chain: "NEAR",
  icon: "powergold",
  rpc: ["https://powergold.aurora.dev"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.powergold.tech",
  chainId: 1313161560,
  networkId: 1313161560,
  explorers: [
    {
      name: "PowerGold explorer",
      url: "https://explorer.powergold.aurora.dev",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
