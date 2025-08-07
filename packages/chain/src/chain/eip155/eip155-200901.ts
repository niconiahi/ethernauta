// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_200901 = {
  name: "Bitlayer Mainnet",
  shortName: "btr",
  chain: "Bitlayer",
  icon: "bitlayer",
  rpc: [
    "https://rpc.bitlayer.org",
    "https://rpc.bitlayer-rpc.com",
    "https://rpc.ankr.com/bitlayer",
    "https://rpc-bitlayer.rockx.com",
    "wss://ws.bitlayer.org",
    "wss://ws.bitlayer-rpc.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://docs.bitlayer.org/",
  chainId: 200901,
  networkId: 200901,
  slip44: 1,
  explorers: [
    {
      name: "bitlayer mainnet scan",
      url: "https://www.btrscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
