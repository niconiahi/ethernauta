import type { Chain } from "../shared"

export const eip155_9134 = {
  name: "GIWA",
  shortName: "giwa",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://giwa.io",
  chainId: 9134,
  networkId: 9134,
  status: "incubating",
} satisfies Chain
