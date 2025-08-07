// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11343 = {
  name: "StateMesh Testnet",
  shortName: "mesh-test",
  chain: "MESH",
  icon: "statemesh",
  rpc: ["https://rpc-test.statemesh.net"],
  faucets: ["https://faucet.statemesh.net"],
  nativeCurrency: {
    name: "StateMesh",
    symbol: "MESH",
    decimals: 18,
  },
  infoURL: "https://statemesh.net",
  chainId: 11343,
  networkId: 11343,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer-test.statemesh.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
