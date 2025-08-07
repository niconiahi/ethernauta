// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5511555 = {
  name: "PointPay Testnet",
  shortName: "PPTEST",
  chain: "pointpay",
  icon: "pointpay",
  rpc: ["https://rpc-testnet.pointpay.io"],
  faucets: [],
  nativeCurrency: {
    name: "PointPay",
    symbol: "PXP",
    decimals: 18,
  },
  infoURL: "https://pointpay.io",
  chainId: 5511555,
  networkId: 5511555,
  explorers: [
    {
      name: "PointPay Testnet Explorer",
      url: "https://testnet.pointpay.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
