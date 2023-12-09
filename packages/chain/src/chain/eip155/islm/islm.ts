/* eslint no-template-curly-in-string: 0 */
export const islm = {
  name: "Haqq Network",
  shortName: "ISLM",
  chain: "Haqq",
  rpc: [
    "https://rpc.eth.haqq.network",
    "https://haqq-evm.publicnode.com",
    "wss://haqq-evm.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Islamic Coin",
    symbol: "ISLM",
    decimals: 18,
  },
  infoURL: "https://islamiccoin.net",
  chainId: 11235,
  networkId: 11235,
  explorers: [
    {
      name: "Mainnet HAQQ Explorer",
      url: "https://explorer.haqq.network",
      standard: "EIP3091",
    },
  ],
} as const
