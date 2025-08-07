// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_88899 = {
  name: "Unite",
  shortName: "unite",
  chain: "UNITE",
  icon: "unite",
  rpc: ["https://unite-mainnet.g.alchemy.com/public"],
  faucets: [],
  nativeCurrency: {
    name: "Unite",
    symbol: "UNITE",
    decimals: 18,
  },
  infoURL: "https://unite.io",
  chainId: 88899,
  networkId: 88899,
  explorers: [
    {
      name: "Unite Explorer",
      url: "https://unite-mainnet.explorer.alchemy.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
