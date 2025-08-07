// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9898 = {
  name: "Larissa Chain",
  shortName: "lrs",
  title: "Larissa Chain",
  chain: "Larissa",
  icon: "larissa",
  rpc: ["https://rpc.larissa.network"],
  faucets: [],
  nativeCurrency: {
    name: "Larissa",
    symbol: "LRS",
    decimals: 18,
  },
  infoURL: "https://larissa.network",
  chainId: 9898,
  networkId: 1,
  slip44: 9898,
  explorers: [
    {
      name: "Larissa Scan",
      url: "https://scan.larissa.network",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
