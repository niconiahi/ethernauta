import type { Chain } from "../shared"

export const eip155_97741 = {
  name: "Pepe Unchained V2",
  shortName: "pepuv2",
  chain: "PEPU",
  icon: "pepu",
  rpc: ["https://rpc-pepu-v2-mainnet-0.t.conduit.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "PEPU",
    symbol: "PEPU",
    decimals: 18,
  },
  infoURL: "https://pepeunchained.com/",
  chainId: 97741,
  networkId: 97741,
  explorers: [
    {
      name: "pepuscan",
      url: "https://pepuscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
