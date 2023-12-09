/* eslint no-template-curly-in-string: 0 */
export const auptick = {
  name: "Uptick Mainnet",
  shortName: "auptick",
  chain: "Uptick",
  icon: "uptick",
  rpc: [
    "https://json-rpc.uptick.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Uptick",
    symbol: "UPTICK",
    decimals: 18,
  },
  infoURL: "https://www.uptick.network",
  chainId: 117,
  networkId: 117,
  explorers: [
    {
      name: "Uptick Explorer",
      url: "https://evm-explorer.uptick.network",
      standard: "none",
    },
  ],
} as const
