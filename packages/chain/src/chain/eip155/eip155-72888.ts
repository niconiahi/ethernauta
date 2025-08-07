// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_72888 = {
  name: "CAGA mainnet",
  shortName: "caga-mainnet",
  chain: "CAGA",
  icon: "caga",
  rpc: [
    "https://cagamainnet.com",
    "wss://cagamainnet.com/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CAGA",
    symbol: "CAGA",
    decimals: 18,
  },
  infoURL: "https://www.cagacrypto.com/",
  chainId: 72888,
  networkId: 72888,
  explorers: [
    {
      name: "caga",
      url: "https://explorer.cagamainnet.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
