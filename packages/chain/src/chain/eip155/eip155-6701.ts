// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6701 = {
  name: "PAXB Mainnet",
  shortName: "PAXB",
  chain: "PAXB",
  icon: "paxb",
  rpc: ["https://chain.paxb.io"],
  faucets: [],
  nativeCurrency: {
    name: "PAXB",
    symbol: "PAXB",
    decimals: 18,
  },
  infoURL: "https://paxb.io/",
  chainId: 6701,
  networkId: 6701,
  explorers: [
    {
      name: "PAXB Explorer",
      url: "https://scan.paxb.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
