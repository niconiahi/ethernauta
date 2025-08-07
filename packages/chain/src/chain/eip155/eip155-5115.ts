// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5115 = {
  name: "Citrea Testnet",
  shortName: "citrea-testnet",
  chain: "Citrea",
  icon: "citrea",
  rpc: ["https://rpc.testnet.citrea.xyz"],
  faucets: ["https://citrea.xyz/faucet"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Citrea BTC",
    symbol: "cBTC",
    decimals: 18,
  },
  infoURL: "https://citrea.xyz",
  chainId: 5115,
  networkId: 5115,
  explorers: [
    {
      name: "Citrea Testnet Explorer",
      url: "https://explorer.testnet.citrea.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
