// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2525 = {
  name: "inEVM Mainnet",
  shortName: "inevm",
  chain: "inEVM",
  icon: "inevm",
  rpc: ["https://mainnet.rpc.inevm.com/http"],
  faucets: [],
  nativeCurrency: {
    name: "Injective",
    symbol: "INJ",
    decimals: 18,
  },
  infoURL: "https://inevm.com",
  chainId: 2525,
  networkId: 2525,
  explorers: [],
  status: "active",
} satisfies Chain
