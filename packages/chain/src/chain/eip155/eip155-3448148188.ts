import type { Chain } from "../shared"

export const eip155_3448148188 = {
  name: "Tron Nile",
  shortName: "tron-nile",
  chain: "TRON",
  icon: "tron",
  rpc: ["https://nile.trongrid.io/jsonrpc"],
  faucets: [],
  nativeCurrency: {
    name: "Tron",
    symbol: "TRX",
    decimals: 6,
  },
  infoURL: "https://tron.network",
  chainId: 3448148188,
  networkId: 3448148188,
  explorers: [
    {
      name: "nile tronscan",
      url: "https://nile.tronscan.org",
      standard: "none",
    },
  ],
} satisfies Chain
