// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_21097 = {
  name: "Rivest Testnet",
  shortName: "rivest-testnet",
  chain: "Inco",
  icon: "inco",
  rpc: [
    "https://validator.rivest.inco.org",
    "https://gateway.rivest.inco.org",
  ],
  faucets: ["https://faucet.rivest.inco.org"],
  nativeCurrency: {
    name: "test-Inco",
    symbol: "tINCO",
    decimals: 18,
  },
  infoURL: "https://inco.org",
  chainId: 21097,
  networkId: 21097,
  slip44: 1,
  explorers: [
    {
      name: "Rivest Testnet Explorer",
      url: "https://explorer.rivest.inco.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
