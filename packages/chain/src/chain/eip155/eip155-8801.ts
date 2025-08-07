// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8801 = {
  name: "Okto Testnet",
  shortName: "okto-testnet",
  chain: "Okto",
  rpc: ["https://rpc.okto-testnet.zeeve.online"],
  faucets: ["https://faucet.okto-testnet.zeeve.online"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Okto",
    symbol: "OKTO",
    decimals: 18,
  },
  infoURL: "",
  chainId: 8801,
  networkId: 8801,
  explorers: [
    {
      name: "Okto Testnet Explorer",
      url: "https://explorer.okto-testnet.zeeve.online",
      standard: "none",
    },
  ],
} satisfies Chain
