// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5333 = {
  name: "Netsbo",
  shortName: "nets",
  chain: "NETSBO",
  icon: "netsbo",
  rpc: ["https://rpc1.netsbo.io", "https://rpc2.netsbo.io"],
  faucets: [],
  nativeCurrency: {
    name: "Netsbo",
    symbol: "NETS",
    decimals: 18,
  },
  infoURL: "https://netsbo.io",
  chainId: 5333,
  networkId: 5333,
  explorers: [
    {
      name: "netsbo",
      url: "https://explorer.netsbo.io",
      standard: "none",
    },
  ],
} satisfies Chain
