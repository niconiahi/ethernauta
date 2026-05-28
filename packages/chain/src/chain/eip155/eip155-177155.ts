import type { Chain } from "../shared"

export const eip155_177155 = {
  name: "mfenx",
  shortName: "mfenx",
  chain: "MFENX",
  rpc: ["https://indexer.mfenx.com/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "JULIAN",
    symbol: "JULIAN",
    decimals: 18,
  },
  infoURL: "https://mfenx.com/power-house",
  chainId: 177155,
  networkId: 177155,
  status: "active",
} satisfies Chain
