/* eslint no-template-curly-in-string: 0 */
export const tntest = {
  name: "Treasurenet Testnet",
  shortName: "tntest",
  chain: "Treasurenet Testnet",
  icon: "treasurenet",
  rpc: [
    "https://node0.testnet.treasurenet.io",
    "https://node1.testnet.treasurenet.io",
    "https://node2.testnet.treasurenet.io",
    "https://node3.testnet.treasurenet.io",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "UNIT",
    symbol: "UNIT",
    decimals: 18,
  },
  infoURL: "https://www.testnet.treasurenet.io",
  chainId: 5005,
  networkId: 5005,
  explorers: [
    {
      name: "Treasurenet EVM BlockExplorer",
      url: "https://evmexplorer.testnet.treasurenet.io",
      standard: "none",
    },
  ],
} as const
