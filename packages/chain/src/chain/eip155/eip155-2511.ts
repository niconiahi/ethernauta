// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2511 = {
  name: "Karak Goerli",
  shortName: "karak-goerli",
  chain: "Karak",
  icon: "karak",
  rpc: ["https://goerli.node1.karak.network"],
  faucets: [],
  nativeCurrency: {
    name: "Karak",
    symbol: "KRK",
    decimals: 18,
  },
  infoURL: "https://karak.network",
  chainId: 2511,
  networkId: 2511,
  explorers: [
    {
      name: "Karak Goerli Explorer",
      url: "https://goerli.scan.karak.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-5",
  },
  status: "deprecated",
} satisfies Chain
