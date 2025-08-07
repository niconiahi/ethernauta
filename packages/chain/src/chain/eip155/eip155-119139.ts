// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_119139 = {
  name: "MetaDAP Enterprise Testnet",
  shortName: "MetaDAP-T",
  title: "MetaDAP Enterprise Testnet",
  chain: "MetaDAP",
  icon: "metadap",
  rpc: [
    "https://rpc.testnet.chain.metadap.io",
    "wss://rpc-ws.testnet.chain.metadap.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "DAP",
    symbol: "DAP",
    decimals: 18,
  },
  infoURL: "https://metadap.io/",
  chainId: 119139,
  networkId: 119139,
  explorers: [
    {
      name: "MetaDAP Enterprise Testnet explorer",
      url: "https://explorer.testnet.chain.metadap.io",
      standard: "none",
    },
  ],
} satisfies Chain
