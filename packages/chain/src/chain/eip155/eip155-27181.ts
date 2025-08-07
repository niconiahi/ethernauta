// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_27181 = {
  name: "KLAOS Nova",
  shortName: "klaosnova",
  title: "KLAOS Nova Test Chain",
  chain: "KLAOS Nova",
  icon: "k-laos",
  rpc: [
    "https://rpc.klaosnova.laosfoundation.io",
    "wss://rpc.klaosnova.laosfoundation.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "KLAOS",
    symbol: "KLAOS",
    decimals: 18,
  },
  infoURL: "https://www.laosfoundation.io/",
  chainId: 27181,
  networkId: 27181,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.klaosnova.laosfoundation.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
