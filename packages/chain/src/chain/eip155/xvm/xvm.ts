/* eslint no-template-curly-in-string: 0 */
export const xvm = {
  name: "Venidium Mainnet",
  shortName: "xvm",
  chain: "XVM",
  icon: "venidium",
  rpc: [
    "https://rpc.venidium.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Venidium",
    symbol: "XVM",
    decimals: 18,
  },
  infoURL: "https://venidium.io",
  chainId: 4919,
  networkId: 4919,
  explorers: [
    {
      name: "Venidium Explorer",
      url: "https://evm.venidiumexplorer.com",
      standard: "EIP3091",
    },
  ],
} as const
