import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_529: Chain = {
  name: "Firechain Mainnet",
  shortName: "fire",
  chain: "FIRE",
  icon: "firechain",
  rpc: [
    "https://mainnet.rpc1.thefirechain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Firechain",
    symbol: "FIRE",
    decimals: 18,
  },
  infoURL: "https://thefirechain.com",
  chainId: 529,
  networkId: 529,
  explorers: [],
  status: "incubating",
}
