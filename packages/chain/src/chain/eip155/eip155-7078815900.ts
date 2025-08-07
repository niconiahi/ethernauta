// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7078815900 = {
  name: "Mekong",
  shortName: "mekong",
  chain: "ETH",
  icon: "ethereum",
  rpc: ["https://rpc.mekong.ethpandaops.io"],
  faucets: ["https://faucet.mekong.ethpandaops.io"],
  nativeCurrency: {
    name: "Testnet ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://mekong.ethpandaops.io",
  chainId: 7078815900,
  networkId: 7078815900,
  explorers: [
    {
      name: "Holesky Dora Explorer",
      url: "https://explorer.mekong.ethpandaops.io",
      standard: "EIP3091",
    },
  ],
  status: "incubating",
} satisfies Chain
