// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1197 = {
  name: "Iora Chain",
  shortName: "iora",
  chain: "IORA",
  icon: "iorachain",
  rpc: ["https://dataseed.iorachain.com"],
  faucets: [],
  nativeCurrency: {
    name: "Iora",
    symbol: "IORA",
    decimals: 18,
  },
  infoURL: "https://iorachain.com",
  chainId: 1197,
  networkId: 1197,
  explorers: [
    {
      name: "ioraexplorer",
      url: "https://explorer.iorachain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
