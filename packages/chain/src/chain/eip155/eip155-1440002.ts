// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1440002 = {
  name: "XRPL EVM Sidechain Devnet",
  shortName: "xrplevmdevnet",
  chain: "XRPLEVM Devnet",
  icon: "xrplevm",
  rpc: [
    "https://rpc.xrplevm.org",
    "https://ws.xrplevm.org",
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
  chainId: 1440002,
  networkId: 1440002,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.xrplevm.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
