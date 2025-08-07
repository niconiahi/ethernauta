// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_248 = {
  name: "Oasys Mainnet",
  shortName: "OAS",
  chain: "Oasys",
  icon: "oasys",
  rpc: ["https://rpc.mainnet.oasys.games"],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://oasys.games",
  chainId: 248,
  networkId: 248,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.oasys.games",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
