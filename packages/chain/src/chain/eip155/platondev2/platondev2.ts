/* eslint no-template-curly-in-string: 0 */
export const platondev2 = {
  name: "PlatON Dev Testnet2",
  shortName: "platondev2",
  chain: "PlatON",
  icon: "platon",
  rpc: [
    "https://devnet2openapi.platon.network/rpc",
    "wss://devnet2openapi.platon.network/ws",
  ],
  faucets: [
    "https://devnet2faucet.platon.network/faucet",
  ],
  nativeCurrency: {
    name: "LAT",
    symbol: "lat",
    decimals: 18,
  },
  infoURL: "https://www.platon.network",
  chainId: 2206132,
  networkId: 1,
  explorers: [
    {
      name: "PlatON explorer",
      url: "https://devnet2scan.platon.network",
      standard: "none",
    },
  ],
} as const
