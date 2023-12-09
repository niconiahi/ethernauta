/* eslint no-template-curly-in-string: 0 */
export const eip155_69 = {
  name: "Optimism Kovan",
  shortName: "okov",
  title: "Optimism Testnet Kovan",
  chain: "ETH",
  rpc: [
    "https://kovan.optimism.io/",
  ],
  faucets: [
    "http://fauceth.komputing.org?chain=69&address=${ADDRESS}",
  ],
  nativeCurrency: {
    name: "Kovan Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://optimism.io",
  chainId: 69,
  networkId: 69,
  explorers: [
    {
      name: "etherscan",
      url: "https://kovan-optimistic.etherscan.io",
      standard: "EIP3091",
    },
  ],
} as const
