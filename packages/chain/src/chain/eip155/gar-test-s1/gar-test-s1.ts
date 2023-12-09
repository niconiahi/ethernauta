/* eslint no-template-curly-in-string: 0 */
export const garTestS1 = {
  name: "Garizon Testnet Stage1",
  shortName: "gar-test-s1",
  chain: "GAR",
  icon: "garizon",
  rpc: [
    "https://s1-testnet.garizon.net/rpc",
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
  chainId: 901,
  networkId: 901,
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
