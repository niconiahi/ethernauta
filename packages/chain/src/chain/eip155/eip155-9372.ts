// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9372 = {
  name: "Oasys Testnet",
  shortName: "OAS_TEST",
  chain: "Oasys",
  icon: "oasys",
  rpc: ["https://rpc.testnet.oasys.games"],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://oasys.games",
  chainId: 9372,
  networkId: 9372,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.testnet.oasys.games",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
