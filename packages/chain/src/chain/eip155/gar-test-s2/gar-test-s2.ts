/* eslint no-template-curly-in-string: 0 */
export const garTestS2 = {
  name: "Garizon Testnet Stage2",
  shortName: "gar-test-s2",
  chain: "GAR",
  icon: "garizon",
  rpc: [
    "https://s2-testnet.garizon.net/rpc",
  ],
  faucets: [
    "https://faucet-testnet.garizon.com",
  ],
  nativeCurrency: {
    name: "Garizon",
    symbol: "GAR",
    decimals: 18,
  },
  infoURL: "https://garizon.com",
  chainId: 902,
  networkId: 902,
  explorers: [
    {
      name: "explorer",
      url: "https://explorer-testnet.garizon.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "shard",
    chain: "eip155-900",
  },
} as const
