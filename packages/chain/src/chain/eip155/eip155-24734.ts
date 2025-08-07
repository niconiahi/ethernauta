// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_24734 = {
  name: "MintMe.com Coin",
  shortName: "mintme",
  chain: "MINTME",
  rpc: ["https://node1.mintme.com"],
  faucets: [],
  nativeCurrency: {
    name: "MintMe.com Coin",
    symbol: "MINTME",
    decimals: 18,
  },
  infoURL: "https://www.mintme.com",
  chainId: 24734,
  networkId: 37480,
} satisfies Chain
