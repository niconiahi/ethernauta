// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_668 = {
  name: "JuncaChain",
  shortName: "junca",
  chain: "JuncaChain",
  rpc: ["https://rpc.juncachain.com"],
  faucets: [],
  nativeCurrency: {
    name: "JuncaChain Native Token",
    symbol: "JGC",
    decimals: 18,
  },
  infoURL: "https://junca-cash.world",
  chainId: 668,
  networkId: 668,
  explorers: [
    {
      name: "JuncaScan",
      url: "https://scan.juncachain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
