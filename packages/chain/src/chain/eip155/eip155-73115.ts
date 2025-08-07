// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_73115 = {
  name: "ICB Network",
  shortName: "ICBX",
  chain: "ICB",
  icon: "icbnetwork",
  rpc: [
    "https://rpc1-mainnet.icbnetwork.info/",
    "https://rpc2-mainnet.icbnetwork.info/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ICB Native Token",
    symbol: "ICBX",
    decimals: 18,
  },
  infoURL: "https://icb.network",
  chainId: 73115,
  networkId: 73115,
  explorers: [
    {
      name: "ICB Explorer",
      url: "https://icbscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
