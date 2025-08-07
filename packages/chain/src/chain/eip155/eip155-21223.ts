// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_21223 = {
  name: "DCpay Mainnet",
  shortName: "DCPm",
  chain: "DCpay",
  icon: "dcpayIcon",
  rpc: ["https://rpc.dcpay.io"],
  faucets: [],
  nativeCurrency: {
    name: "DCP",
    symbol: "DCP",
    decimals: 18,
  },
  infoURL: "https://dcpay.io",
  chainId: 21223,
  networkId: 21223,
  explorers: [
    {
      name: "DCpay Mainnet Explorer",
      url: "https://mainnet.dcpay.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
