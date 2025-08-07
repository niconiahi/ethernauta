// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_48795 = {
  name: "Space Subnet Testnet",
  shortName: "spacetestnet",
  chain: "SPACETESTNET",
  rpc: ["https://subnets.avax.network/space/testnet/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "FUEL",
    symbol: "FUEL",
    decimals: 18,
  },
  infoURL: "https://otherworld.network",
  chainId: 48795,
  networkId: 48795,
  explorers: [
    {
      name: "SPACE Explorer",
      url: "https://subnets-test.avax.network/space",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
