// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_80069 = {
  name: "Berachain Bepolia",
  shortName: "berachain-bepolia",
  chain: "Berachain",
  icon: "berachain",
  rpc: ["https://bepolia.rpc.berachain.com"],
  faucets: [],
  nativeCurrency: {
    name: "Testnet BERA Token",
    symbol: "BERA",
    decimals: 18,
  },
  infoURL: "https://www.berachain.com",
  chainId: 80069,
  networkId: 80069,
  explorers: [
    {
      name: "Beratrail",
      url: "https://bepolia.beratrail.io",
      standard: "none",
    },
  ],
} satisfies Chain
