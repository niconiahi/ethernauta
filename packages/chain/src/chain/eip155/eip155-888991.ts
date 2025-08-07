// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_888991 = {
  name: "Unite Testnet",
  shortName: "unitetestnet",
  chain: "UNITE",
  rpc: ["https://unite-testnet.g.alchemy.com/public"],
  faucets: [],
  nativeCurrency: {
    name: "Testnet Unite",
    symbol: "UNITE",
    decimals: 18,
  },
  infoURL: "https://unite.io",
  chainId: 888991,
  networkId: 888991,
  explorers: [
    {
      name: "Unite Testnet Explorer",
      url: "https://unite-testnet.explorer.alchemy.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
