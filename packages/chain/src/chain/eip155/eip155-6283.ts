// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6283 = {
  name: "LAOS",
  shortName: "laosnetwork",
  title: "LAOS Mainnet",
  chain: "LAOS",
  icon: "laosnetwork",
  rpc: [
    "https://rpc.laos.laosfoundation.io",
    "wss://rpc.laos.laosfoundation.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "LAOS",
    symbol: "LAOS",
    decimals: 18,
  },
  infoURL: "https://laosnetwork.io",
  chainId: 6283,
  networkId: 6283,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.laos.laosfoundation.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
