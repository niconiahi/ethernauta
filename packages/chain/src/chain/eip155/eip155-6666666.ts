// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6666666 = {
  name: "Safe(AnWang) Testnet",
  shortName: "SafeTestnet",
  chain: "Safe(AnWang)",
  icon: "safe-anwang",
  rpc: ["https://rpc-testnet.anwang.com"],
  faucets: [],
  nativeCurrency: {
    name: "SAFE(AnWang)",
    symbol: "SAFE",
    decimals: 18,
  },
  infoURL: "https://www.anwang.com",
  chainId: 6666666,
  networkId: 6666666,
  explorers: [
    {
      name: "Safe(AnWang) Testnet Explorer",
      url: "http://safe4-testnet.anwang.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
