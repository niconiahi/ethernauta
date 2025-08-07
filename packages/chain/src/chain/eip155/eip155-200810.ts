// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_200810 = {
  name: "Bitlayer Testnet",
  shortName: "btrt",
  chain: "Bitlayer",
  icon: "bitlayer",
  rpc: [
    "https://testnet-rpc.bitlayer.org",
    "wss://testnet-ws.bitlayer.org",
    "https://testnet-rpc.bitlayer-rpc.com",
    "wss://testnet-ws.bitlayer-rpc.com",
    "https://rpc.ankr.com/bitlayer_testnet",
  ],
  faucets: ["https://www.bitlayer.org/faucet"],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://docs.bitlayer.org/",
  chainId: 200810,
  networkId: 200810,
  slip44: 1,
  explorers: [
    {
      name: "bitlayer testnet scan",
      url: "https://testnet.btrscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
