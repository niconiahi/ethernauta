// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9999 = {
  name: "myOwn Testnet",
  shortName: "myn",
  chain: "myOwn",
  rpc: ["https://geth.dev.bccloud.net"],
  faucets: [],
  nativeCurrency: {
    name: "MYN",
    symbol: "MYN",
    decimals: 18,
  },
  infoURL: "https://docs.bccloud.net/",
  chainId: 9999,
  networkId: 9999,
  slip44: 1,
} satisfies Chain
