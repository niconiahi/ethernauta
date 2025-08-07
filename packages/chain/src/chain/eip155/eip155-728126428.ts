// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_728126428 = {
  name: "Tron Mainnet",
  shortName: "tron",
  chain: "TRON",
  icon: "tron",
  rpc: [
    "https://rpc.ankr.com/tron_jsonrpc",
    "https://api.trongrid.io/jsonrpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Tron",
    symbol: "TRX",
    decimals: 6,
  },
  infoURL: "https://tron.network",
  chainId: 728126428,
  networkId: 728126428,
  slip44: 195,
  explorers: [
    {
      name: "tronscan",
      url: "https://tronscan.org",
      standard: "none",
    },
  ],
} satisfies Chain
