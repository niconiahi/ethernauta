// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_767368 = {
  name: "Lamina1 Identity Testnet",
  shortName: "lamina1idtest",
  chain: "Lamina1 Identity Testnet",
  rpc: [
    "https://subnets.avax.network/lamina1id/testnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "L1ID Test",
    symbol: "L1IDT",
    decimals: 18,
  },
  infoURL: "https://fuji.lamina1.com/",
  chainId: 767368,
  networkId: 767368,
  slip44: 1,
  explorers: [
    {
      name: "Lamina1 Identity Testnet Explorer",
      url: "https://subnets-test.avax.network/lamina1id",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
