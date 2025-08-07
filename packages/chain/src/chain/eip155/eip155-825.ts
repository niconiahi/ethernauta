// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_825 = {
  name: "Daily Network Testnet",
  shortName: "tdly",
  chain: "Daily Network",
  icon: "daily",
  rpc: ["https://rpc.testnet.dailycrypto.net"],
  faucets: [],
  nativeCurrency: {
    name: "Daily",
    symbol: "DLY",
    decimals: 18,
  },
  infoURL: "https://dailycrypto.net",
  chainId: 825,
  networkId: 825,
  explorers: [
    {
      name: "Daily Testnet Explorer",
      url: "https://explorer.testnet.dailycrypto.net",
      standard: "none",
    },
  ],
} satisfies Chain
