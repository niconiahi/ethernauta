// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_696969 = {
  name: "Galadriel Devnet",
  shortName: "galadriel-devnet",
  chain: "Galadriel",
  rpc: ["https://devnet.galadriel.com"],
  faucets: ["https://docs.galadriel.com/faucet"],
  nativeCurrency: {
    name: "Galadriel Devnet token",
    symbol: "GAL",
    decimals: 18,
  },
  infoURL: "https://galadriel.com",
  chainId: 696969,
  networkId: 696969,
  explorers: [
    {
      name: "Galadriel Explorer",
      url: "https://explorer.galadriel.com",
      standard: "none",
    },
  ],
} satisfies Chain
