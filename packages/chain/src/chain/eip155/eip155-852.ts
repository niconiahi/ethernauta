// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_852 = {
  name: "HongKong Mainnet",
  shortName: "HongKong",
  chain: "HONGKONG",
  rpc: ["https://eth.jegotrip.net"],
  faucets: [],
  nativeCurrency: {
    name: "HongKong",
    symbol: "HK",
    decimals: 18,
  },
  infoURL: "https://www.cmi.chinamobile.com/",
  chainId: 852,
  networkId: 852,
  explorers: [
    {
      name: "HongKong Mainnet Explorer",
      url: "http://47.238.205.52",
      standard: "none",
    },
  ],
} satisfies Chain
