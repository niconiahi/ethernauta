// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_355113 = {
  name: "Bitfinity Network Testnet",
  shortName: "bitfinity-testnet",
  chain: "BTF",
  rpc: ["https://testnet.bitfinity.network"],
  faucets: ["https://bitfinity.network/faucet"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Bitfinity Token",
    symbol: "BTF",
    decimals: 18,
  },
  infoURL: "https://bitfinity.network",
  chainId: 355113,
  networkId: 355113,
  explorers: [
    {
      name: "Bitfinity Testnet Block Explorer",
      url: "https://explorer.testnet.bitfinity.network",
      standard: "EIP3091",
    },
    {
      name: "Bitfinity Testnet Block Explorer",
      url: "https://bitfinity-test.dex.guru",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
