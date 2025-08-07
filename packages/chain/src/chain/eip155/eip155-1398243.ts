// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1398243 = {
  name: "Automata Testnet",
  shortName: "automatatest",
  chain: "Automata Testnet",
  icon: "automata",
  rpc: [
    "https://rpc-testnet.ata.network",
    "https://automata-testnet.alt.technology",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ATA",
    symbol: "ATA",
    decimals: 18,
  },
  infoURL: "https://ata.network",
  chainId: 1398243,
  networkId: 1398243,
  explorers: [
    {
      name: "Automata Testnet Explorer",
      url: "https://explorer-testnet.ata.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
