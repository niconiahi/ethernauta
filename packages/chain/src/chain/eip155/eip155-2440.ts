// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2440 = {
  name: "Atleta Network",
  shortName: "atla",
  chain: "Atleta",
  icon: "atleta",
  rpc: [
    "https://rpc.mainnet.atleta.network",
    "wss://rpc.mainnet.atleta.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Atla",
    symbol: "ATLA",
    decimals: 18,
  },
  infoURL: "https://atleta.network",
  chainId: 2440,
  networkId: 2440,
  slip44: 965,
  explorers: [
    {
      name: "Atleta Explorer",
      url: "https://blockscout.atleta.network",
      standard: "none",
    },
    {
      name: "Atleta Polka Explorer",
      url: "https://polkadot-explorer.atleta.network/#/explorer",
      standard: "none",
    },
  ],
} satisfies Chain
