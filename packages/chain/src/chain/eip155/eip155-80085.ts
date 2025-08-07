// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_80085 = {
  name: "Berachain Artio",
  shortName: "berachainArtio",
  chain: "Berachain Artio",
  icon: "berachain",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "BERA Token",
    symbol: "BERA",
    decimals: 18,
  },
  infoURL: "https://www.berachain.com",
  chainId: 80085,
  networkId: 80085,
  explorers: [
    {
      name: "Beratrail",
      url: "https://artio.beratrail.io",
      standard: "none",
    },
  ],
  status: "deprecated",
} satisfies Chain
