// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_105105 = {
  name: "Stratis Mainnet",
  shortName: "stratis",
  chain: "Stratis",
  icon: "stratis",
  rpc: ["https://rpc.stratisevm.com"],
  faucets: [],
  nativeCurrency: {
    name: "Stratis",
    symbol: "STRAX",
    decimals: 18,
  },
  infoURL: "https://www.stratisplatform.com",
  chainId: 105105,
  networkId: 105105,
  explorers: [
    {
      name: "Stratis Explorer",
      url: "https://explorer.stratisevm.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
