// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_202202 = {
  name: "Bethel Sydney",
  shortName: "bethel-sydney",
  chain: "Bethel",
  rpc: ["https://rpc-sydney.bethel.network"],
  faucets: ["https://faucet-sydney.bethel.network"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Bethel",
    symbol: "BECX",
    decimals: 18,
  },
  infoURL: "",
  chainId: 202202,
  networkId: 202202,
  explorers: [
    {
      name: "Betehl Sydney Explorer",
      url: "https://sydney.bethel.network",
      standard: "none",
    },
  ],
} satisfies Chain
