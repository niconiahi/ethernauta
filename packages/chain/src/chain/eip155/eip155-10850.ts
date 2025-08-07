// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10850 = {
  name: "Lamina1 Identity",
  shortName: "lamina1id",
  chain: "Lamina1 Identity",
  rpc: [
    "https://subnets.avax.network/lamina1id/mainnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "L1 ID",
    symbol: "L1ID",
    decimals: 18,
  },
  infoURL: "https://www.lamina1.com/",
  chainId: 10850,
  networkId: 10850,
  slip44: 1,
  explorers: [
    {
      name: "Lamina1 Identity Explorer",
      url: "https://subnets.avax.network/lamina1id",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
