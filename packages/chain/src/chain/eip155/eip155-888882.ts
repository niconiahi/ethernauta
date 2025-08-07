// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_888882 = {
  name: "REXX Mainnet",
  shortName: "REXX",
  title: "REXX Mainnet",
  chain: "REXX",
  rpc: ["https://rpc.rexxnetwork.com"],
  faucets: [],
  nativeCurrency: {
    name: "REXX",
    symbol: "REXX",
    decimals: 18,
  },
  infoURL: "https://rexxnetwork.com",
  chainId: 888882,
  networkId: 888882,
  explorers: [
    {
      name: "REXX Mainnet Explorer",
      url: "https://rexxnetwork.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
