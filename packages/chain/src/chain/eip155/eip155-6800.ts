import type { Chain } from "../shared"

export const eip155_6800 = {
  name: "BM Chain",
  shortName: "bmx",
  chain: "BMX",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "BMX",
    symbol: "BMX",
    decimals: 18,
  },
  infoURL: "https://bm.xyz",
  chainId: 6800,
  networkId: 6800,
  explorers: [],
  status: "incubating",
} satisfies Chain
