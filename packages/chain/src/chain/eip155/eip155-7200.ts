// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7200 = {
  name: "exSat Mainnet",
  shortName: "xsat",
  chain: "exSat",
  icon: "exsat",
  rpc: ["https://evm.exsat.network"],
  faucets: [],
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://exsat.network/",
  chainId: 7200,
  networkId: 7200,
  explorers: [
    {
      name: "exSat Explorer",
      url: "https://scan.exsat.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "",
      },
    ],
  },
} satisfies Chain
