// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_233 = {
  name: "Ethernity Testnet",
  shortName: "ethernity-testnet",
  chain: "Ethernity",
  rpc: ["https://testnet.ethernitychain.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.ethernity.io",
  chainId: 233,
  networkId: 233,
  explorers: [
    {
      name: "Ethernity Testnet Explorer",
      url: "https://testnet.ernscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
