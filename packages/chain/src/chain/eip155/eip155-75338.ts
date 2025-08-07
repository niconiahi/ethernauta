// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_75338 = {
  name: "AppLayer Testnet",
  shortName: "applayer-testnet",
  chain: "AppLayer",
  rpc: ["https://testnet-api.applayer.com"],
  faucets: ["https://testnet-faucet.applayer.com"],
  features: [
    {
      name: "EIP55",
    },
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "AppLayer",
    symbol: "APPL",
    decimals: 18,
  },
  infoURL: "https://applayer.com",
  chainId: 75338,
  networkId: 75338,
  explorers: [
    {
      name: "Applayer Testnet Explorer",
      url: "https://testnet-explorer.applayer.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
