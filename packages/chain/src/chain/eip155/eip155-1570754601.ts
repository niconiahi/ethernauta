// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1570754601 = {
  name: "Haust Testnet",
  shortName: "hst-test",
  title: "Haust Testnet",
  chain: "Haust-testnet",
  icon: "haust",
  rpc: ["https://rpc-test.haust.network"],
  faucets: [
    "https://haust-testnet-faucet.eu-north-2.gateway.fm",
  ],
  nativeCurrency: {
    name: "HAUST",
    symbol: "HAUST",
    decimals: 18,
  },
  infoURL: "https://haust.network/",
  chainId: 1570754601,
  networkId: 1570754601,
  explorers: [
    {
      name: "blockscout",
      url: "https://haust-testnet-blockscout.eu-north-2.gateway.fm",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://haust-testnet-bridge.eu-north-2.gateway.fm",
      },
    ],
  },
} satisfies Chain
