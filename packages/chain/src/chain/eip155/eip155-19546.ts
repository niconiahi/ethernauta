// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19546 = {
  name: "Zytron Linea Testnet",
  shortName: "zytron-linea-testnet",
  chain: "ETH",
  icon: "zytron",
  rpc: ["https://linea-testnet-zytron.zypher.game/"],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://zytron.zypher.network/",
  chainId: 19546,
  networkId: 19546,
  explorers: [
    {
      name: "blockscout",
      url: "https://linea-testnet-zytron-blockscout.zypher.game",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
