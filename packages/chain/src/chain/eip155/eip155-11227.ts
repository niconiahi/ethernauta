// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11227 = {
  name: "Jiritsu Testnet Subnet",
  shortName: "jiritsutes",
  chain: "JIRITSUTES",
  rpc: [
    "https://subnets.avax.network/jiritsutes/testnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "JIRI",
    symbol: "TZW",
    decimals: 18,
  },
  infoURL: "https://jiritsu.network",
  chainId: 11227,
  networkId: 11227,
  explorers: [
    {
      name: "JIRITSUTES Explorer",
      url: "https://subnets-test.avax.network/jiritsutes",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
