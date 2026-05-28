import type { Chain } from "../shared"

export const eip155_33772211 = {
  name: "Xone Testnet",
  shortName: "tXOC",
  chain: "XOC",
  icon: "xone_test",
  rpc: [
    "https://rpc-testnet.xone.plus",
    "https://rpc-testnet.xone.org",
    "https://rpc-testnet.knight.center",
    "wss://rpc-testnet.xone.org",
  ],
  faucets: ["https://faucet.xone.org/"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Xone Coin",
    symbol: "XOC",
    decimals: 18,
  },
  infoURL: "https://xone.org",
  chainId: 33772211,
  networkId: 33772211,
  explorers: [
    {
      name: "xone_test",
      url: "https://testnet.xonescan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
