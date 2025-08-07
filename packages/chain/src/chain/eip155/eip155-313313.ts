// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_313313 = {
  name: "Sahara AI Testnet",
  shortName: "saharatest",
  chain: "Sahara",
  icon: "sahara",
  rpc: ["https://testnet.saharalabs.ai"],
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
    name: "Sahara AI",
    symbol: "SAHARA",
    decimals: 18,
  },
  infoURL: "https://saharalabs.ai",
  chainId: 313313,
  networkId: 313313,
  explorers: [
    {
      name: "Testnet Scan",
      url: "https://testnet-explorer.saharalabs.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
