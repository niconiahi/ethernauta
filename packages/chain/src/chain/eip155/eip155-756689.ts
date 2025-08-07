// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_756689 = {
  name: "PAYSCAN CHAIN",
  shortName: "payscan",
  chain: "PAYSCAN CHAIN",
  rpc: ["https://rpc.payscan.live"],
  faucets: [],
  nativeCurrency: {
    name: "PYZ",
    symbol: "PYZ",
    decimals: 18,
  },
  infoURL: "https://payscan.live",
  chainId: 756689,
  networkId: 756689,
  slip44: 108,
  explorers: [
    {
      name: "PAYSCAN CHAIN",
      url: "https://payscan.live",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
