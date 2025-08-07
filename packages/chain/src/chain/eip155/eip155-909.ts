// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_909 = {
  name: "Portal Fantasy Chain",
  shortName: "PF",
  chain: "PF",
  icon: "pf",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Portal Fantasy Token",
    symbol: "PFT",
    decimals: 18,
  },
  infoURL: "https://portalfantasy.io",
  chainId: 909,
  networkId: 909,
  explorers: [],
  status: "incubating",
} satisfies Chain
