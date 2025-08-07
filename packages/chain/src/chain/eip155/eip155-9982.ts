// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9982 = {
  name: "MFEV CHAIN MAINNET",
  shortName: "mfevscan",
  chain: "MFEV CHAIN",
  rpc: ["https://rpc.mfevscan.com"],
  faucets: [],
  nativeCurrency: {
    name: "MFEV",
    symbol: "MFEV",
    decimals: 18,
  },
  infoURL: "https://mfevscan.com",
  chainId: 9982,
  networkId: 9982,
  slip44: 108,
  explorers: [
    {
      name: "MFEV CHAIN",
      url: "https://mfevscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
