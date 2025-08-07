// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6912115 = {
  name: "ENI Testnet",
  shortName: "eni-test",
  chain: "ENI",
  icon: "eni-test",
  rpc: ["https://rpc-testnet.eniac.network"],
  faucets: [],
  nativeCurrency: {
    name: "ENI Testnet Token",
    symbol: "ENI",
    decimals: 18,
  },
  infoURL: "https://eniac.network/",
  chainId: 6912115,
  networkId: 6912115,
  explorers: [
    {
      name: "ENI Testnet Explorer",
      url: "https://scan-testnet.eniac.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
