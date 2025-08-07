// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_65536 = {
  name: "Automata Mainnet",
  shortName: "automatamainnet",
  chain: "Automata Mainnet",
  icon: "automata",
  rpc: [
    "https://rpc.ata.network",
    "https://automata-mainnet.alt.technology/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ATA",
    symbol: "ATA",
    decimals: 18,
  },
  infoURL: "https://ata.network",
  chainId: 65536,
  networkId: 65536,
  explorers: [
    {
      name: "Automata Explorer",
      url: "https://explorer.ata.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
