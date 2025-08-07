// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_77787778 = {
  name: "0xHash Testnet",
  shortName: "HETH",
  chain: "HETH",
  icon: "ethereum",
  rpc: ["https://rpc-test.0xhash.io"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "0xHash",
    symbol: "HETH",
    decimals: 18,
  },
  infoURL: "https://0xhash.io",
  chainId: 77787778,
  networkId: 77787778,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://test.0xhashscan.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://app.optimism.io/bridge/deposit",
      },
    ],
  },
} satisfies Chain
