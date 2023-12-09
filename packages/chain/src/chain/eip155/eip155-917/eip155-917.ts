/* eslint no-template-curly-in-string: 0 */
export const eip155_917 = {
  name: "Rinia Testnet",
  shortName: "tfire",
  chain: "FIRE",
  icon: "rinia",
  rpc: [
    "https://rinia.rpc1.thefirechain.com",
  ],
  faucets: [
    "https://faucet.thefirechain.com",
  ],
  nativeCurrency: {
    name: "Firechain",
    symbol: "FIRE",
    decimals: 18,
  },
  infoURL: "https://thefirechain.com",
  chainId: 917,
  networkId: 917,
  explorers: [],
  status: "incubating",
} as const
