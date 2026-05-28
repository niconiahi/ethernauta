import type { Chain } from "../shared"

export const eip155_5734951 = {
  name: "Jovay Mainnet",
  shortName: "jovay",
  chain: "ETH",
  icon: "jovay",
  rpc: [
    "https://rpc.jovay.io",
    "https://api.zan.top/node/v1/jovay/mainnet/${ZAN_API_KEY}",
    "wss://api.zan.top/node/ws/v1/jovay/mainnet/${ZAN_API_KEY}",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://jovay.io",
  chainId: 5734951,
  networkId: 5734951,
  explorers: [
    {
      name: "Jovay Explorer",
      url: "https://explorer.jovay.io/l2",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [],
  },
  status: "active",
} satisfies Chain
