/* eslint no-template-curly-in-string: 0 */
export const alayadev = {
  name: "Alaya Dev Testnet",
  shortName: "alayadev",
  chain: "Alaya",
  icon: "alaya",
  rpc: [
    "https://devnetopenapi.alaya.network/rpc",
    "wss://devnetopenapi.alaya.network/ws",
  ],
  faucets: [
    "https://faucet.alaya.network/faucet/?id=f93426c0887f11eb83b900163e06151c",
  ],
  nativeCurrency: {
    name: "ATP",
    symbol: "atp",
    decimals: 18,
  },
  infoURL: "https://www.alaya.network/",
  chainId: 201030,
  networkId: 1,
  explorers: [
    {
      name: "alaya explorer",
      url: "https://devnetscan.alaya.network",
      standard: "none",
    },
  ],
} as const