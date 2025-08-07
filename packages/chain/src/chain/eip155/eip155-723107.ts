// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_723107 = {
  name: "TixChain Testnet",
  shortName: "tixchain",
  chain: "TIXCHAIN",
  rpc: [
    "https://subnets.avax.network/tixchain/testnet/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TIX Token",
    symbol: "TIX",
    decimals: 18,
  },
  infoURL:
    "https://subnets-test.avax.network/tixchain/details",
  chainId: 723107,
  networkId: 723107,
  explorers: [
    {
      name: "TixChain Testnet Subnet Explorer",
      url: "https://subnets-test.avax.network/tixchain",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
