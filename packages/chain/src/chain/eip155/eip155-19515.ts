// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19515 = {
  name: "SEC Testnet",
  shortName: "SEPt",
  chain: "SEC",
  icon: "secIcon",
  rpc: ["https://testnet-rpc.secexplorer.io"],
  faucets: ["https://faucet.secexplorer.io"],
  nativeCurrency: {
    name: "SEP",
    symbol: "SEP",
    decimals: 18,
  },
  infoURL: "https://smartenergychain.org",
  chainId: 19515,
  networkId: 19515,
  explorers: [
    {
      name: "SEC Testnet Explorer",
      url: "https://testnet.secexplorer.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
