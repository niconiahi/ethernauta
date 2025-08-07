// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1449000 = {
  name: "XRPL EVM Sidechain Testnet",
  shortName: "xrplevmtestnet",
  chain: "XRPLEVM Testnet",
  icon: "xrplevm",
  rpc: [
    "https://rpc.testnet.xrplevm.org",
    "https://ws.testnet.xrplevm.org",
  ],
  faucets: ["https://faucet.xrplevm.org"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "XRP",
    symbol: "XRP",
    decimals: 18,
  },
  infoURL: "https://xrplevm.org",
  chainId: 1449000,
  networkId: 1449000,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.testnet.xrplevm.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
