// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_224400 = {
  name: "CONET Mainnet",
  shortName: "conet-mainnet",
  chain: "CONET Mainnet",
  icon: "conet",
  rpc: ["https://mainnet-rpc.conet.network"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "CONET ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://conet.network",
  chainId: 224400,
  networkId: 224400,
  slip44: 2147708048,
  explorers: [
    {
      name: "CONET Mainnet Explorer",
      url: "https://mainnet.conet.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
