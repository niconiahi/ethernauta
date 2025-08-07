// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1731313 = {
  name: "Turkey Demo Dev",
  shortName: "TDD",
  chain: "ETH",
  rpc: ["https://devchain-poa.huabeizhenxuan.com"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 1731313,
  networkId: 1731313,
} satisfies Chain
