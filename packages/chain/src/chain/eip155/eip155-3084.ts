// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3084 = {
  name: "XL Network Testnet",
  shortName: "nysl",
  chain: "XL Network Testnet",
  icon: "nysl",
  rpc: [
    "https://subnets.avax.network/xlnetworkt/testnet/rpc",
    "wss://subnets.avax.network/xlnetworkt/testnet/ws",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "XLNetwork",
    symbol: "XLN",
    decimals: 18,
  },
  infoURL: "https://www.nysl.io/",
  chainId: 3084,
  networkId: 3084,
  explorers: [
    {
      name: "XL Network Explorer",
      url: "https://subnets-test.avax.network/xlnetworkt",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
