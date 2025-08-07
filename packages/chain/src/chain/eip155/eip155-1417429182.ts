// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1417429182 = {
  name: "Zephyr Testnet",
  shortName: "zephyr",
  title: "Zephyr Testnet",
  chain: "Zephyr-testnet",
  icon: "zephyr",
  rpc: ["https://zephyr-rpc.eu-north-2.gateway.fm"],
  faucets: ["https://zephyr-faucet.eu-north-2.gateway.fm"],
  nativeCurrency: {
    name: "ZERO",
    symbol: "Z",
    decimals: 18,
  },
  infoURL: "https://zero.tech",
  chainId: 1417429182,
  networkId: 1417429182,
  explorers: [
    {
      name: "blockscout",
      url: "https://zephyr-blockscout.eu-north-2.gateway.fm",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://zephyr-bridge.eu-north-2.gateway.fm",
      },
    ],
  },
} satisfies Chain
