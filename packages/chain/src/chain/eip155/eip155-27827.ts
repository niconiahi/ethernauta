// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_27827 = {
  name: "zeroone Mainnet Subnet",
  shortName: "zeroonemai",
  chain: "ZEROONEMAI",
  rpc: [
    "https://subnets.avax.network/zeroonemai/mainnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "ZERO",
    symbol: "ZERO",
    decimals: 18,
  },
  infoURL: "https://zeroone.art/",
  chainId: 27827,
  networkId: 27827,
  explorers: [
    {
      name: "ZEROONEMAI Explorer",
      url: "https://subnets.avax.network/zeroonemai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
