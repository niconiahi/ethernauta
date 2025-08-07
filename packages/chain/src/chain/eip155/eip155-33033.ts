// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_33033 = {
  name: "Entangle Mainnet",
  shortName: "ngl",
  chain: "NGL",
  icon: "ngl",
  rpc: ["https://json-rpc.entangle.fi"],
  faucets: [],
  nativeCurrency: {
    name: "Entangle",
    symbol: "NGL",
    decimals: 18,
  },
  infoURL: "https://www.entangle.fi",
  chainId: 33033,
  networkId: 33033,
  explorers: [
    {
      name: "Entangle Mainnet Explorer",
      url: "https://explorer.entangle.fi",
      standard: "none",
    },
  ],
} satisfies Chain
