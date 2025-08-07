// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3637 = {
  name: "Botanix Mainnet",
  shortName: "BTNX",
  chain: "BOTANIX",
  icon: "botanix",
  rpc: ["https://rpc.botanixlabs.com"],
  faucets: [],
  nativeCurrency: {
    name: "Botanix",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://botanixlabs.com",
  chainId: 3637,
  networkId: 3637,
  explorers: [
    {
      name: "Botanix Explorer",
      url: "https://botanixscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
