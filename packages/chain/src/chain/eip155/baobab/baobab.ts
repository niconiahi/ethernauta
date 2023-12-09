/* eslint no-template-curly-in-string: 0 */
export const baobab = {
  name: "Klaytn Testnet Baobab",
  shortName: "Baobab",
  chain: "KLAY",
  rpc: [
    "https://api.baobab.klaytn.net:8651",
  ],
  faucets: [
    "https://baobab.wallet.klaytn.com/access?next=faucet",
  ],
  nativeCurrency: {
    name: "KLAY",
    symbol: "KLAY",
    decimals: 18,
  },
  infoURL: "https://www.klaytn.com/",
  chainId: 1001,
  networkId: 1001,
  explorers: [
    {
      name: "klaytnscope",
      url: "https://scope.klaytn.com",
      standard: "EIP3091",
    },
  ],
} as const
