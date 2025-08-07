// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3416255149 = {
  name: "Ultima Mainnet",
  shortName: "ultima",
  chain: "ULTIMA",
  icon: "ultima",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ultima",
    symbol: "ULTIMA",
    decimals: 6,
  },
  infoURL: "https://ultima.io",
  chainId: 3416255149,
  networkId: 3416255149,
  slip44: 785,
  explorers: [
    {
      name: "ultimachain",
      url: "https://ultimachain.info",
      standard: "none",
    },
  ],
} satisfies Chain
