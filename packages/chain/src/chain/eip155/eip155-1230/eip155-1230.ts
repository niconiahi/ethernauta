/* eslint no-template-curly-in-string: 0 */
export const eip155_1230 = {
  name: "Ultron Testnet",
  shortName: "UltronTestnet",
  chain: "Ultron",
  icon: "ultron",
  rpc: [
    "https://ultron-dev.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ultron",
    symbol: "ULX",
    decimals: 18,
  },
  infoURL: "https://ultron.foundation",
  chainId: 1230,
  networkId: 1230,
  explorers: [
    {
      name: "Ultron Testnet Explorer",
      url: "https://explorer.ultron-dev.io",
      standard: "none",
    },
  ],
} as const
