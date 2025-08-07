// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1927 = {
  name: "Arvix Testnet",
  shortName: "arvix",
  chain: "Arvix",
  icon: "arvix",
  rpc: [
    "https://rpc-testnet-market.arvix.network",
    "https://rpc-dev-testnet.arvix.network",
  ],
  faucets: ["https://claim-faucet.arvix.network"],
  nativeCurrency: {
    name: "Arvix Testnet Native Token",
    symbol: "tARV",
    decimals: 18,
  },
  infoURL: "https://arvix.network",
  chainId: 1927,
  networkId: 1927,
  explorers: [
    {
      name: "Arvix Explorer Testnet",
      url: "https://testnet.arvixscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
