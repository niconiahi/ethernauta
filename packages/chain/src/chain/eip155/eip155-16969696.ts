// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_16969696 = {
  name: "Privix Chain Mainnet",
  shortName: "mpsc",
  chain: "PRIVIX",
  icon: "privix",
  rpc: [
    "https://mainnet-rpc.privixchain.xyz/",
    "wss://mainnet-rpc.privixchain.xyz/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Privix Coin",
    symbol: "PRIVIX",
    decimals: 18,
  },
  infoURL: "https://privix.co/",
  chainId: 16969696,
  networkId: 16969696,
  explorers: [
    {
      name: "blockscout",
      url: "https://privixscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
