// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_24125 = {
  name: "Nexurachain",
  shortName: "XURAm",
  chain: "nexurachain",
  icon: "xuraIcon",
  rpc: ["https://rpc.nexurachain.io"],
  faucets: [],
  nativeCurrency: {
    name: "XURA",
    symbol: "XURA",
    decimals: 18,
  },
  infoURL: "https://nexurachain.io",
  chainId: 24125,
  networkId: 24125,
  explorers: [
    {
      name: "Nexurachain Explorer",
      url: "https://explorer.nexurachain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
