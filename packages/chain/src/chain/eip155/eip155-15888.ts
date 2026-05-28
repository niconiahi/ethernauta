import type { Chain } from "../shared"

export const eip155_15888 = {
  name: "Bitroot",
  shortName: "bitroot",
  chain: "Bitroot",
  rpc: [
    "https://rpc.bitroot.co",
    "https://mainnet-rpc.bitroot.co",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BRT",
    symbol: "BRT",
    decimals: 18,
  },
  infoURL: "https://bitroot.co",
  chainId: 15888,
  networkId: 15888,
  explorers: [
    {
      name: "Bitroot Explorer",
      url: "https://explorer.bitroot.co",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
