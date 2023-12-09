/* eslint no-template-curly-in-string: 0 */
export const utronMainnet = {
  name: "Ultron Mainnet",
  shortName: "UtronMainnet",
  chain: "Ultron",
  icon: "ultron",
  rpc: [
    "https://ultron-rpc.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ultron",
    symbol: "ULX",
    decimals: 18,
  },
  infoURL: "https://ultron.foundation",
  chainId: 1231,
  networkId: 1231,
  explorers: [
    {
      name: "Ultron Explorer",
      url: "https://ulxscan.com",
      standard: "none",
    },
  ],
} as const
