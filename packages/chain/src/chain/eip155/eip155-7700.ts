// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7700 = {
  name: "Canto",
  shortName: "canto",
  chain: "Canto",
  rpc: [
    "https://canto.slingshot.finance",
    "https://canto-rpc.ansybl.io",
    "https://mainnode.plexnode.org:8545",
    "https://canto.gravitychain.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Canto",
    symbol: "CANTO",
    decimals: 18,
  },
  infoURL: "https://canto.io",
  chainId: 7700,
  networkId: 7700,
  explorers: [
    {
      name: "Canto Explorer (OKLink)",
      url: "https://www.oklink.com/canto",
      standard: "EIP3091",
    },
    {
      name: "Canto EVM Explorer (Blockscout)",
      url: "https://tuber.build",
      standard: "EIP3091",
    },
    {
      name: "dexguru",
      url: "https://canto.dex.guru",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
