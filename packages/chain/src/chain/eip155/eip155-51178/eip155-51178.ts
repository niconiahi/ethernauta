/* eslint no-template-curly-in-string: 0 */
export const eip155_51178 = {
  name: "Lumoz Testnet Alpha",
  shortName: "Lumoz-Testnet",
  chain: "ETH",
  icon: "opside-new",
  rpc: [
    "https://alpha-us-http-geth.lumoz.org",
    "https://alpha-hk-http-geth.lumoz.org",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Lumoz Test Token",
    symbol: "MOZ",
    decimals: 18,
  },
  infoURL: "https://lumoz.org",
  chainId: 51178,
  networkId: 51178,
  explorers: [
    {
      name: "LumozTestnetInfo",
      url: "https://lumoz.info",
      standard: "EIP3091",
    },
  ],
} as const