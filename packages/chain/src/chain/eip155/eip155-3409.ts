// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3409 = {
  name: "Pepe Unchained",
  shortName: "PEPU",
  chain: "PEPU",
  icon: "pepu",
  rpc: [
    "https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "PEPU",
    symbol: "PEPU",
    decimals: 18,
  },
  infoURL: "https://pepeunchained.com/",
  chainId: 3409,
  networkId: 3409,
  explorers: [
    {
      name: "pepuscan",
      url: "https://pepuscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
