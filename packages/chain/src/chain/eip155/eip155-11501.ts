// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11501 = {
  name: "GEB Mainnet",
  shortName: "geb",
  chain: "GEB",
  icon: "geb",
  rpc: [
    "https://rpc-mainnet-1.geb.network/",
    "https://rpc-mainnet-2.geb.network/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://geb.network",
  chainId: 11501,
  networkId: 11501,
  explorers: [
    {
      name: "geb mainnet scan",
      url: "https://scan.geb.network",
      standard: "none",
    },
    {
      name: "bevm mainnet oklink",
      url: "https://www.oklink.com/bevm",
      standard: "none",
    },
  ],
} satisfies Chain
