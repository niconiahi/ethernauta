// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_27 = {
  name: "ShibaChain",
  shortName: "shib",
  chain: "SHIB",
  rpc: ["https://rpc.shibchain.org"],
  faucets: [],
  nativeCurrency: {
    name: "SHIBA INU COIN",
    symbol: "SHIB",
    decimals: 18,
  },
  infoURL: "https://shibchain.org",
  chainId: 27,
  networkId: 27,
  explorers: [
    {
      name: "Shiba Explorer",
      url: "https://exp.shibchain.org",
      standard: "none",
    },
  ],
} satisfies Chain
