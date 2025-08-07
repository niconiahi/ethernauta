// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10321 = {
  name: "TAO EVM Mainnet",
  shortName: "TAOm",
  chain: "TAO EVM",
  icon: "taoevmIcon",
  rpc: ["https://rpc.taoevm.io"],
  faucets: [],
  nativeCurrency: {
    name: "TAO",
    symbol: "TAO",
    decimals: 18,
  },
  infoURL: "https://taoevm.io",
  chainId: 10321,
  networkId: 10321,
  explorers: [
    {
      name: "TAO Mainnet Explorer",
      url: "https://taoscan.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
