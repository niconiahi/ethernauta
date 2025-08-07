// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_132902 = {
  name: "Form Testnet",
  shortName: "formtestnet",
  title: "Form Testnet",
  chain: "formtestnet",
  rpc: [
    "https://sepolia-rpc.form.network/http",
    "wss://sepolia-rpc.form.network/ws",
  ],
  faucets: ["https://info.form.network/faucet"],
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
  infoURL: "https://sepolia-info.form.network",
  chainId: 132902,
  networkId: 132902,
  explorers: [
    {
      name: "Form Testnet explorer",
      url: "https://sepolia-explorer.form.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://sepolia-op-bridge.form.network",
      },
    ],
  },
} satisfies Chain
