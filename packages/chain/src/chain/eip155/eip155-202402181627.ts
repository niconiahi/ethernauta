// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_202402181627 = {
  name: "GM Network Testnet",
  shortName: "gmnetwork-testnet",
  chain: "GM Network Testnet",
  rpc: ["https://gmnetwork-testnet.alt.technology/"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://gmnetwork.ai",
  chainId: 202402181627,
  networkId: 202402181627,
  explorers: [
    {
      name: "gmnetwork-testnet",
      url: "https://gmnetwork-testnet-explorer.alt.technology",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
