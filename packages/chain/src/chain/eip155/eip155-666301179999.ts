// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_666301179999 = {
  name: "SmartPay Mobile Money",
  shortName: "SmartPay",
  chain: "Mobile Money",
  icon: "smartpay",
  rpc: ["https://network.uat.smartmoneyewallet.com/"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "SmartPay Mobile Money",
    symbol: "SMM",
    decimals: 18,
  },
  infoURL: "https://network.uat.smartmoneyewallet.com/",
  chainId: 666301179999,
  networkId: 666301179999,
} satisfies Chain
