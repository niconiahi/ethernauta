import type { Chain } from "../shared"

export const eip155_763375 = {
  name: "Surge Testnet",
  shortName: "surge-testnet",
  chain: "Surge Testnet",
  icon: "surge-testnet",
  rpc: [
    "https://l2-rpc.hoodi.surge.wtf",
    "wss://l2-ws.hoodi.surge.wtf",
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://surge.wtf",
  chainId: 763375,
  networkId: 763375,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.hoodi.surge.wtf",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
