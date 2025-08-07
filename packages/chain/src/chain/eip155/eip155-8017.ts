// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8017 = {
  name: "iSunCoin Mainnet",
  shortName: "isc",
  chain: "iSunCoin",
  icon: "isuncoin",
  rpc: ["https://mainnet.isuncoin.com"],
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
    name: "ISC",
    symbol: "ISC",
    decimals: 18,
  },
  infoURL: "https://isuncoin.com",
  chainId: 8017,
  networkId: 8017,
  slip44: 8017,
  explorers: [
    {
      name: "iSunCoin Explorer",
      url: "https://baifa.io/app/chains/8017",
      standard: "none",
    },
  ],
} satisfies Chain
