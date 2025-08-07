// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1605 = {
  name: "Betherance",
  shortName: "Beth",
  chain: "Beth",
  icon: "betherance",
  rpc: ["https://rpc.bethscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "Betherance",
    symbol: "BETH",
    decimals: 18,
  },
  infoURL: "https://rpc.bethscan.io",
  chainId: 1605,
  networkId: 1605,
  explorers: [
    {
      name: "bethscan",
      url: "https://bethscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
