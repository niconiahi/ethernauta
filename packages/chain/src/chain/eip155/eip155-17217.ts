// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_17217 = {
  name: "KONET Mainnet",
  shortName: "KONET",
  chain: "KONET",
  icon: "konet",
  rpc: ["https://api.kon-wallet.com"],
  faucets: [],
  nativeCurrency: {
    name: "KONET",
    symbol: "KONET",
    decimals: 18,
  },
  infoURL: "https://konetmain.com",
  chainId: 17217,
  networkId: 17217,
  slip44: 1,
  explorers: [
    {
      name: "konet-explorer",
      url: "https://explorer.kon-wallet.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
