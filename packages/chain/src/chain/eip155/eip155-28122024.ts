// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_28122024 = {
  name: "Ancient8 Testnet",
  shortName: "a8",
  chain: "Ancient8",
  icon: "ancient8",
  rpc: ["https://rpcv2-testnet.ancient8.gg"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ancient8.gg/",
  chainId: 28122024,
  networkId: 28122024,
  slip44: 1,
  explorers: [
    {
      name: "scan-testnet",
      url: "https://scanv2-testnet.ancient8.gg",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
