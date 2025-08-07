// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2040 = {
  name: "Vanar Mainnet",
  shortName: "Vanar",
  title: "Vanarchain",
  chain: "VANAR",
  icon: "vanar",
  rpc: [
    "https://rpc.vanarchain.com",
    "wss://ws.vanarchain.com",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "VANRY",
    symbol: "VANRY",
    decimals: 18,
  },
  infoURL: "https://vanarchain.com",
  chainId: 2040,
  networkId: 2040,
  explorers: [
    {
      name: "Vanar Explorer",
      url: "https://explorer.vanarchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
