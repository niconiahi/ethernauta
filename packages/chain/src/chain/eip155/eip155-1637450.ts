// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1637450 = {
  name: "Xterio Testnet",
  shortName: "xteriotest",
  chain: "Xterio Testnet",
  rpc: ["https://xterio-testnet.alt.technology"],
  faucets: [],
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  infoURL: "https://xter.io",
  chainId: 1637450,
  networkId: 1637450,
  explorers: [
    {
      name: "Xterio Testnet Explorer",
      url: "https://testnet.xterscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
