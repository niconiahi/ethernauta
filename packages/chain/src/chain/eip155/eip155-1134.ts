// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1134 = {
  name: "StateMesh",
  shortName: "mesh",
  chain: "MESH",
  icon: "statemesh",
  rpc: ["https://rpc.statemesh.net"],
  faucets: [],
  nativeCurrency: {
    name: "StateMesh",
    symbol: "MESH",
    decimals: 18,
  },
  infoURL: "https://statemesh.net",
  chainId: 1134,
  networkId: 1134,
  slip44: 1134,
  explorers: [
    {
      name: "blockscout",
      url: "https://scan.statemesh.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
