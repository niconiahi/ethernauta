// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_266 = {
  name: "Neura",
  shortName: "neura",
  title: "Neura Mainnet",
  chain: "NEURA",
  icon: "neura",
  rpc: [],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Ankr",
    symbol: "ANKR",
    decimals: 18,
  },
  infoURL: "https://www.neuraprotocol.io/",
  chainId: 266,
  networkId: 266,
  explorers: [],
  status: "incubating",
} satisfies Chain
