// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_21224 = {
  name: "DCpay Testnet",
  shortName: "DCPt",
  chain: "DCpay",
  icon: "dcpayIcon",
  rpc: ["https://testnet-rpc.dcpay.io"],
  faucets: ["https://faucet.dcpay.io"],
  nativeCurrency: {
    name: "DCP",
    symbol: "DCP",
    decimals: 18,
  },
  infoURL: "https://dcpay.io",
  chainId: 21224,
  networkId: 21224,
  explorers: [
    {
      name: "DCpay Testnet Explorer",
      url: "https://testnet.dcpay.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
