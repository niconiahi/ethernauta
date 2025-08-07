// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_839999 = {
  name: "exSat Testnet",
  shortName: "txsat",
  chain: "exSat",
  icon: "exsat",
  rpc: ["https://evm-tst3.exsat.network"],
  faucets: [],
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://exsat.network/",
  chainId: 839999,
  networkId: 839999,
  explorers: [
    {
      name: "exSat Testnet Explorer",
      url: "https://scan-testnet.exsat.network",
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
