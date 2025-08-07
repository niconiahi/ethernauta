// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_64002 = {
  name: "XCHAIN Testnet",
  shortName: "xct",
  chain: "XCHAIN",
  rpc: ["https://xchain-testnet-rpc.kuma.bid"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://kuma.bid",
  chainId: 64002,
  networkId: 64002,
  explorers: [
    {
      name: "XCHAIN Testnet Explorer",
      url: "https://xchain-testnet-explorer.kuma.bid",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
