// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2016 = {
  name: "MainnetZ Mainnet",
  shortName: "netz",
  chain: "NetZ",
  icon: "mainnetz",
  rpc: [
    "https://mainnet-rpc.mainnetz.io",
    "https://eu-rpc.mainnetz.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MainnetZ",
    symbol: "NetZ",
    decimals: 18,
  },
  infoURL: "https://mainnetz.io",
  chainId: 2016,
  networkId: 2016,
  explorers: [
    {
      name: "MainnetZ",
      url: "https://explorer.mainnetz.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
