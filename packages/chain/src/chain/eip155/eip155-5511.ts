// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5511 = {
  name: "PointPay Mainnet",
  shortName: "PP",
  chain: "pointpay",
  icon: "pointpay",
  rpc: ["https://rpc-mainnet.pointpay.io"],
  faucets: [],
  nativeCurrency: {
    name: "PointPay",
    symbol: "PXP",
    decimals: 18,
  },
  infoURL: "https://pointpay.io",
  chainId: 5511,
  networkId: 5511,
  explorers: [
    {
      name: "PointPay Mainnet Explorer",
      url: "https://explorer.pointpay.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
