// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_995 = {
  name: "5ireChain Mainnet",
  shortName: "5ire",
  chain: "5ireChain",
  icon: "5ireChain",
  rpc: ["https://rpc.5ire.network"],
  faucets: [],
  nativeCurrency: {
    name: "5ire Token",
    symbol: "5ire",
    decimals: 18,
  },
  infoURL: "https://5ire.org",
  chainId: 995,
  networkId: 995,
  explorers: [
    {
      name: "5ireChain Explorer",
      url: "https://5irescan.io",
      standard: "none",
    },
  ],
} satisfies Chain
