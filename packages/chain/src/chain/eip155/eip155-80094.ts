// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_80094 = {
  name: "Berachain",
  shortName: "berachain",
  chain: "Berachain",
  icon: "berachain",
  rpc: [
    "https://rpc.berachain.com",
    "https://berachain-rpc.publicnode.com",
    "wss://berachain-rpc.publicnode.com",
    "https://rpc.berachain-apis.com",
    "wss://rpc.berachain-apis.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BERA Token",
    symbol: "BERA",
    decimals: 18,
  },
  infoURL: "https://www.berachain.com",
  chainId: 80094,
  networkId: 80094,
  explorers: [
    {
      name: "Berascan",
      url: "https://berascan.com",
      standard: "EIP3091",
    },
    {
      name: "Beratrail",
      url: "https://beratrail.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
