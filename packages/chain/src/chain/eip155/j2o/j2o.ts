/* eslint no-template-curly-in-string: 0 */
export const j2O = {
  name: "J2O Taro",
  shortName: "j2o",
  chain: "TARO",
  rpc: [
    "https://rpc.j2o.io",
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
    name: "TARO Coin",
    symbol: "taro",
    decimals: 18,
  },
  infoURL: "https://j2o.io",
  chainId: 35011,
  networkId: 35011,
  explorers: [
    {
      name: "J2O Taro Explorer",
      url: "https://exp.j2o.io",
      standard: "EIP3091",
    },
  ],
} as const