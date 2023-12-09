/* eslint no-template-curly-in-string: 0 */
export const trnPorcini = {
  name: "The Root Network - Porcini Testnet",
  shortName: "trn-porcini",
  chain: "TRN",
  rpc: [
    "https://porcini.rootnet.app/archive",
    "wss://porcini.rootnet.app/archive/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "XRP",
    symbol: "XRP",
    decimals: 6,
  },
  infoURL: "https://www.futureverse.com/technology/root",
  chainId: 7672,
  networkId: 7672,
  explorers: [
    {
      name: "rootnet",
      url: "https://explorer.rootnet.cloud",
      standard: "EIP3091",
    },
  ],
} as const
