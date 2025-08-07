// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_14088 = {
  name: "Zeroth Testnet",
  shortName: "ZRHt",
  chain: "Zeroth",
  icon: "zeroth",
  rpc: ["https://test-my.zeroth.run"],
  faucets: [],
  nativeCurrency: {
    name: "Zeroth",
    symbol: "ZRHt",
    decimals: 18,
  },
  infoURL: "https://www.zeroth.foundation",
  chainId: 14088,
  networkId: 14088,
  explorers: [
    {
      name: "Zeroth Explorer",
      url: "https://test-scan.zeroth.run",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
