// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2039 = {
  name: "Aleph Zero",
  shortName: "aleph",
  chain: "Aleph Zero",
  icon: "aleph",
  rpc: [
    "https://rpc.alephzero-testnet.gelato.digital",
    "wss://rpc.alephzero-testnet.gelato.digital",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TZERO",
    symbol: "TZERO",
    decimals: 18,
  },
  infoURL: "https://alephzero.org/",
  chainId: 2039,
  networkId: 2039,
  explorers: [
    {
      name: "Aleph Zero",
      url: "https://evm-explorer-testnet.alephzero.org",
      standard: "none",
    },
  ],
} satisfies Chain
