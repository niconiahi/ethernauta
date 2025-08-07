// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2863311531 = {
  name: "Ancient8 Testnet (deprecated)",
  shortName: "a8old",
  chain: "Ancient8",
  icon: "ancient8",
  rpc: ["https://rpc-testnet.ancient8.gg"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ancient8.gg/",
  chainId: 2863311531,
  networkId: 2863311531,
  slip44: 1,
  explorers: [
    {
      name: "a8scan-testnet",
      url: "https://testnet.a8scan.io",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} satisfies Chain
