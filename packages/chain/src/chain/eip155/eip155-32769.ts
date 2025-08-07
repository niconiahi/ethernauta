// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_32769 = {
  name: "Zilliqa EVM",
  shortName: "zil",
  chain: "ZIL",
  icon: "zilliqa",
  rpc: ["https://api.zilliqa.com"],
  faucets: [],
  nativeCurrency: {
    name: "Zilliqa",
    symbol: "ZIL",
    decimals: 18,
  },
  infoURL: "https://www.zilliqa.com/",
  chainId: 32769,
  networkId: 32769,
  explorers: [
    {
      name: "Zilliqa EVM Explorer",
      url: "https://evmx.zilliqa.com",
      standard: "none",
    },
  ],
} satisfies Chain
