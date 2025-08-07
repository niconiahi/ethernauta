// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10849 = {
  name: "Lamina1",
  shortName: "lamina1",
  chain: "Lamina1",
  rpc: ["https://subnets.avax.network/lamina1/mainnet/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "L1",
    symbol: "L1",
    decimals: 18,
  },
  infoURL: "https://www.lamina1.com/",
  chainId: 10849,
  networkId: 10849,
  slip44: 1,
  explorers: [
    {
      name: "Lamina1 Explorer",
      url: "https://subnets.avax.network/lamina1",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
