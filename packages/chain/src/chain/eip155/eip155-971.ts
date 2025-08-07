// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_971 = {
  name: "Oort Huygens",
  shortName: "Huygens",
  chain: "Huygens",
  icon: "ccn",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Oort",
    symbol: "CCN",
    decimals: 18,
  },
  infoURL: "https://oortech.com",
  chainId: 971,
  networkId: 971,
} satisfies Chain
