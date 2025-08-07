// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9998 = {
  name: "Ztc Mainnet",
  shortName: "ZTC",
  chain: "ZTC",
  rpc: ["https://zitcoin.us"],
  faucets: [],
  nativeCurrency: {
    name: "Ztcer",
    symbol: "ZTC",
    decimals: 5,
  },
  infoURL: "https://ztc.best",
  chainId: 9998,
  networkId: 9998,
} satisfies Chain
