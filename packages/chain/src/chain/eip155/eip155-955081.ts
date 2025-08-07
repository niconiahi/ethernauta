// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_955081 = {
  name: "Jono12 Subnet",
  shortName: "jono12",
  chain: "JONO12",
  icon: "jono12",
  rpc: ["https://subnets.avax.network/jono12/testnet/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Jono12 Token",
    symbol: "JONO",
    decimals: 18,
  },
  infoURL: "",
  chainId: 955081,
  networkId: 955081,
  explorers: [
    {
      name: "JONO12 Explorer",
      url: "https://subnets-test.avax.network/jono12",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
