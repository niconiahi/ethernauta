// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_918273 = {
  name: "Owshen Mainnet",
  shortName: "owshen-mainnet",
  chain: "ETH",
  icon: "owshen",
  rpc: ["https://rpc.owshen.io"],
  faucets: [],
  nativeCurrency: {
    name: "DIVE",
    symbol: "DIVE",
    decimals: 18,
  },
  infoURL: "https://owshen.io",
  chainId: 918273,
  networkId: 918273,
  explorers: [],
  status: "active",
} satisfies Chain
