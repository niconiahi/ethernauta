/* eslint no-template-curly-in-string: 0 */
export const eip155_999 = {
  name: "Wanchain Testnet",
  shortName: "twan",
  chain: "WAN",
  rpc: [
    "https://gwan-ssl.wandevs.org:46891/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Wancoin",
    symbol: "WAN",
    decimals: 18,
  },
  infoURL: "https://testnet.wanscan.org",
  chainId: 999,
  networkId: 999,
} as const
