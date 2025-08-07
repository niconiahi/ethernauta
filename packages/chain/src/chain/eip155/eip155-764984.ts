// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_764984 = {
  name: "Lamina1 Testnet",
  shortName: "lamina1test",
  chain: "Lamina1 Testnet",
  rpc: [
    "https://subnets.avax.network/lamina1tes/testnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Lamina1 Test",
    symbol: "L1T",
    decimals: 18,
  },
  infoURL: "https://fuji.lamina1.com/",
  chainId: 764984,
  networkId: 764984,
  slip44: 1,
  explorers: [
    {
      name: "Lamina1 Test Explorer",
      url: "https://subnets-test.avax.network/lamina1tes",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
