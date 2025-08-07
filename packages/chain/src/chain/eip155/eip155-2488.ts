// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2488 = {
  name: "NOW Chain Mainnet",
  shortName: "now",
  chain: "NOW",
  icon: "nowchain",
  rpc: ["https://rpc.nowscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "NOW Coin",
    symbol: "NOW",
    decimals: 18,
  },
  infoURL: "https://nowchain.co",
  chainId: 2488,
  networkId: 2488,
  explorers: [
    {
      name: "NOW Scan",
      url: "https://nowscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
