import type { Chain } from "../shared"

export const eip155_560000 = {
  name: "Hetu Mainnet",
  shortName: "HETU",
  chain: "HETU",
  rpc: ["https://rpc.va.hetu.org"],
  faucets: [],
  nativeCurrency: {
    name: "HETU",
    symbol: "HETU",
    decimals: 18,
  },
  infoURL: "https://hetu.org",
  chainId: 560000,
  networkId: 560000,
  explorers: [
    {
      name: "Hetu Mainnet Scan",
      url: "https://scan.v1.hetu.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
