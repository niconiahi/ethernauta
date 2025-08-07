// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2141 = {
  name: "Oneness TestNet",
  shortName: "oneness-testnet",
  chain: "Oneness-Testnet",
  rpc: ["https://rpc.testnet.onenesslabs.io/"],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "",
  chainId: 2141,
  networkId: 2141,
  explorers: [
    {
      name: "oneness-testnet",
      url: "https://scan.testnet.onenesslabs.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
