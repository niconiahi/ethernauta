// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_66665 = {
  name: "Creator Chain Testnet",
  shortName: "ceth",
  chain: "creatorchain",
  icon: "creatorchain",
  rpc: ["https://rpc.creatorchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "CreatorETH",
    symbol: "CETH",
    decimals: 18,
  },
  infoURL: "https://docs.creatorchain.io/",
  chainId: 66665,
  networkId: 66665,
  explorers: [
    {
      name: "creatorchainscan",
      url: "https://explorer.creatorchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
