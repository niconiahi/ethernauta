// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_98881 = {
  name: "Ebi Chain",
  shortName: "ebi",
  title: "Ebi Chain",
  chain: "Ebi",
  rpc: ["https://rpc.ebi.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ebi.xyz",
  chainId: 98881,
  networkId: 98881,
  status: "incubating",
} satisfies Chain
