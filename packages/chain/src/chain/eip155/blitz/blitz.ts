/* eslint no-template-curly-in-string: 0 */
export const blitz = {
  name: "Blitz Subnet",
  shortName: "blitz",
  chain: "BLITZ",
  rpc: [
    "https://subnets.avax.network/blitz/testnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "BLITZ GAS",
    symbol: "BGAS",
    decimals: 18,
  },
  infoURL: "https://blitz.gg",
  chainId: 1343,
  networkId: 1343,
  explorers: [
    {
      name: "BLITZ Explorer",
      url: "https://subnets-test.avax.network/blitz",
      standard: "EIP3091",
    },
  ],
} as const