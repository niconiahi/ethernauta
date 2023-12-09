/* eslint no-template-curly-in-string: 0 */
export const netZt = {
  name: "MainnetZ Testnet",
  shortName: "NetZt",
  chain: "NetZ",
  icon: "mainnetzTestnet",
  rpc: [
    "https://testnet-rpc.mainnetz.io",
  ],
  faucets: [
    "https://faucet.mainnetz.io",
  ],
  nativeCurrency: {
    name: "MainnetZ",
    symbol: "NetZ",
    decimals: 18,
  },
  infoURL: "https://testnet.mainnetz.io",
  chainId: 9768,
  networkId: 9768,
  explorers: [
    {
      name: "MainnetZ",
      url: "https://testnet.mainnetz.io",
      standard: "EIP3091",
    },
  ],
} as const
