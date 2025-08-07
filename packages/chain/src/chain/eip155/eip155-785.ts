// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_785 = {
  name: "AUTHEO Testnet",
  shortName: "autheo-Test-Chain",
  chain: "AUTHEO Testnet",
  rpc: ["https://testnet-rpc1.autheo.com"],
  faucets: ["https://testnet-faucet.autheo.com"],
  nativeCurrency: {
    name: "THEO",
    symbol: "THEO",
    decimals: 18,
  },
  infoURL: "https://autheo.com",
  chainId: 785,
  networkId: 785,
  explorers: [
    {
      name: "tracehawk",
      url: "https://testnet-explorer.autheo.com",
      standard: "none",
    },
  ],
} satisfies Chain
