import type { Chain } from "../shared"

export const eip155_77778 = {
  name: "StreetDog Chain",
  shortName: "sdc",
  chain: "SDC",
  rpc: ["https://rpc.chain.streetdog.me"],
  faucets: [],
  nativeCurrency: {
    name: "StreetDog",
    symbol: "SD",
    decimals: 18,
  },
  infoURL: "https://chain.streetdog.me",
  chainId: 77778,
  networkId: 77778,
  explorers: [
    {
      name: "StreetDog Chain Explorer",
      url: "https://chain.streetdog.me",
      standard: "none",
    },
  ],
} satisfies Chain
