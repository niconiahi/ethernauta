// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6342 = {
  name: "MegaETH Testnet",
  shortName: "megatest",
  chain: "ETH",
  rpc: [
    "https://carrot.megaeth.com/rpc",
    "wss://carrot.megaeth.com/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MegaETH Testnet Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://testnet.megaeth.com",
  chainId: 6342,
  networkId: 6342,
  slip44: 1,
} satisfies Chain
