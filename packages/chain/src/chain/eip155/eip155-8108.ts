// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8108 = {
  name: "ZenChain",
  shortName: "zen",
  chain: "ZTC",
  icon: "zenchain",
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
    name: "ZTC",
    symbol: "ZTC",
    decimals: 18,
  },
  infoURL: "https://zenchain.io",
  chainId: 8108,
  networkId: 8108,
  slip44: 60,
  explorers: [],
  status: "incubating",
} satisfies Chain
