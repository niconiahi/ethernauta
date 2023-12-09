/* eslint no-template-curly-in-string: 0 */
export const dogSt = {
  name: "Dogcoin Testnet",
  shortName: "DOGSt",
  chain: "DOGS",
  icon: "dogs",
  rpc: [
    "https://testnet-rpc.dogcoin.me",
  ],
  faucets: [
    "https://faucet.dogcoin.network",
  ],
  nativeCurrency: {
    name: "Dogcoin",
    symbol: "DOGS",
    decimals: 18,
  },
  infoURL: "https://dogcoin.network",
  chainId: 9339,
  networkId: 9339,
  explorers: [
    {
      name: "Dogcoin",
      url: "https://testnet.dogcoin.network",
      standard: "EIP3091",
    },
  ],
} as const
