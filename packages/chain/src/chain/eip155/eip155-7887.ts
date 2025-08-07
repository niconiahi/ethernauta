// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7887 = {
  name: "Kinto Mainnet",
  shortName: "kintoMainnet",
  chain: "Kinto Mainnet",
  icon: "kinto",
  rpc: [
    "https://rpc.kinto.xyz/http",
    "https://kinto-mainnet.calderachain.xyz/http",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://kinto.xyz",
  chainId: 7887,
  networkId: 7887,
  explorers: [
    {
      name: "Kinto Explorer",
      url: "https://explorer.kinto.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
