// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4460 = {
  name: "Orderly Sepolia Testnet",
  shortName: "orderlyl2",
  chain: "ETH",
  icon: "orderlyTestnet",
  rpc: ["https://testnet-rpc.orderly.org"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://orderly.network",
  chainId: 4460,
  networkId: 4460,
  slip44: 1,
  explorers: [
    {
      name: "basescout",
      url: "https://testnet-explorer.orderly.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
