// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_33772211 = {
  name: "Xone Testnet",
  shortName: "txoc",
  chain: "XOC",
  icon: "xone-test",
  rpc: [
    "https://rpc-testnet.xone.plus",
    "https://rpc-testnet.xone.org",
    "https://rpc-testnet.knight.center",
    "wss://wss-rpc-testnet.xone.org",
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
      name: "testnet-xscscan",
      url: "https://testnet.xscscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
