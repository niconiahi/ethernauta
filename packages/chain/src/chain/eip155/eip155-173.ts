// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_173 = {
  name: "ENI Mainnet",
  shortName: "eni",
  chain: "ENI",
  icon: "eni",
  rpc: ["https://rpc.eniac.network"],
  faucets: [],
  nativeCurrency: {
    name: "ENI",
    symbol: "ENI",
    decimals: 18,
  },
  infoURL: "https://eniac.network/",
  chainId: 173,
  networkId: 173,
  explorers: [
    {
      name: "ENI Explorer",
      url: "https://scan.eniac.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
