// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_97766 = {
  name: "MetaBenz CHAIN",
  shortName: "metabenzscan",
  chain: "MetaBenz CHAIN",
  rpc: ["https://rpc.metabenzscan.com"],
  faucets: [],
  nativeCurrency: {
    name: "MBC",
    symbol: "MBC",
    decimals: 18,
  },
  infoURL: "https://metabenzscan.com",
  chainId: 97766,
  networkId: 97766,
  slip44: 108,
  explorers: [
    {
      name: "MetaBenz CHAIN",
      url: "https://metabenzscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
