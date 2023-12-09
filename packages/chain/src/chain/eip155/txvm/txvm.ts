/* eslint no-template-curly-in-string: 0 */
export const txvm = {
  name: "Venidium Testnet",
  shortName: "txvm",
  chain: "XVM",
  rpc: [
    "https://rpc-evm-testnet.venidium.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Venidium",
    symbol: "XVM",
    decimals: 18,
  },
  infoURL: "https://venidium.io",
  chainId: 4918,
  networkId: 4918,
  explorers: [
    {
      name: "Venidium EVM Testnet Explorer",
      url: "https://evm-testnet.venidiumexplorer.com",
      standard: "EIP3091",
    },
  ],
} as const
