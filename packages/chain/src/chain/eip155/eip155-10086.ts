// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10086 = {
  name: "SJATSH",
  shortName: "SJ",
  chain: "ETH",
  rpc: ["http://geth.free.idcfengye.com"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://sjis.me",
  chainId: 10086,
  networkId: 10086,
} satisfies Chain
