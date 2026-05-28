import type { Chain } from "../shared"

export const eip155_6801 = {
  name: "BM Chain Testnet",
  shortName: "bmx-testnet",
  chain: "BMX",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "BMX",
    symbol: "BMX",
    decimals: 18,
  },
  infoURL: "https://bm.xyz",
  chainId: 6801,
  networkId: 6801,
  slip44: 1,
  explorers: [],
  status: "incubating",
} satisfies Chain
