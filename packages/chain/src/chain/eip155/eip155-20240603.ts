// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_20240603 = {
  name: "DBK Chain",
  shortName: "dbkchain",
  chain: "DBK Chain",
  icon: "dbkchain",
  rpc: ["https://rpc.mainnet.dbkchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.dbkchain.io",
  chainId: 20240603,
  networkId: 20240603,
  explorers: [
    {
      name: "DBK Chain Explorer",
      url: "https://scan.dbkchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
