// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1248 = {
  name: "Dogether Mainnet",
  shortName: "Dogether",
  chain: "Dogether",
  rpc: ["https://rpc.dogether.dog/"],
  faucets: [],
  nativeCurrency: {
    name: "Dogether",
    symbol: "dogeth",
    decimals: 18,
  },
  infoURL: "https://www.dogether.dog/",
  chainId: 1248,
  networkId: 1248,
  explorers: [
    {
      name: "DogetherExplorer",
      url: "https://explorer.dogether.dog",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
