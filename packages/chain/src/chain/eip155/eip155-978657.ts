// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_978657 = {
  name: "Treasure Ruby",
  shortName: "treasure-ruby",
  chain: "TRS",
  icon: "treasureruby",
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
    name: "Testnet MAGIC",
    symbol: "MAGIC",
    decimals: 18,
  },
  infoURL: "https://app.treasure.lol",
  chainId: 978657,
  networkId: 978657,
  slip44: 1,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [],
  },
  status: "deprecated",
} satisfies Chain
