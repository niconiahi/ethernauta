// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_20143 = {
  name: "Monad Devnet",
  shortName: "mon-devnet",
  chain: "MON",
  icon: "monad",
  rpc: [],
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
    name: "Devnet MON Token",
    symbol: "MON",
    decimals: 18,
  },
  infoURL: "https://monad.xyz",
  chainId: 20143,
  networkId: 20143,
  slip44: 1,
  explorers: [],
} satisfies Chain
