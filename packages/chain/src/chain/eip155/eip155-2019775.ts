import type { Chain } from "../shared"

export const eip155_2019775 = {
  name: "Jovay Sepolia Testnet",
  shortName: "jovay-sepolia",
  chain: "ETH",
  icon: "jovay",
  rpc: [
    "https://api.zan.top/public/jovay-testnet",
    "https://api.zan.top/node/v1/jovay/testnet/${ZAN_API_KEY}",
    "wss://api.zan.top/node/ws/v1/jovay/testnet/${ZAN_API_KEY}",
  ],
  faucets: ["https://zan.top/faucet/jovay"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://jovay.io",
  chainId: 2019775,
  networkId: 2019775,
  slip44: 1,
  explorers: [
    {
      name: "Jovay Testnet Explorer",
      url: "https://sepolia-explorer.jovay.io/l2",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://docs.jovay.io/guide/developer-quickstart",
      },
    ],
  },
  status: "active",
} satisfies Chain
