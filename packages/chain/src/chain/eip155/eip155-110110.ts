// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_110110 = {
  name: "Mars Credit",
  shortName: "mars",
  chain: "MARS",
  icon: "marscredit",
  rpc: [
    "https://node99-production-dd5f.up.railway.app:443",
    "https://rpc.marscredit.xyz:443",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Mars Credit",
    symbol: "MARS",
    decimals: 18,
  },
  infoURL: "https://marscredit.xyz/",
  chainId: 110110,
  networkId: 110110,
  slip44: 1,
  explorers: [],
  redFlags: [],
} satisfies Chain
