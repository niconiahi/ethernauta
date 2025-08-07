// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_17071 = {
  name: "Onchain Points",
  shortName: "pop",
  chain: "POP",
  icon: "pop",
  rpc: [
    "https://rpc.onchainpoints.xyz",
    "https://rpc-onchain-points-8n0qkkpr2j.t.conduit.xyz/{CONDUIT_API_KEY}",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OnchainPoints.xyz",
    symbol: "POP",
    decimals: 18,
  },
  infoURL: "https://onchainpoints.xyz",
  chainId: 17071,
  networkId: 17071,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.onchainpoints.xyz",
      standard: "EIP3091",
    },
  ],
  status: "incubating",
} satisfies Chain
