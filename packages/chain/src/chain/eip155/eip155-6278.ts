// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6278 = {
  name: "Rails",
  shortName: "rails",
  title: "Rails Network Mainnet",
  chain: "RAILS",
  icon: "rails",
  rpc: ["https://mainnet.steamexchange.io"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
    {
      name: "EIP6551",
    },
  ],
  nativeCurrency: {
    name: "SteamX",
    symbol: "STEAMX",
    decimals: 18,
  },
  infoURL: "https://steamexchange.io",
  chainId: 6278,
  networkId: 6278,
  slip44: 6278,
  explorers: [
    {
      name: "blockscout",
      url: "https://explore.steamexchange.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
