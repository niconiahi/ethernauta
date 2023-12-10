import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_26600: Chain = {
  name: "Hertz Network Mainnet",
  shortName: "HTZ",
  chain: "HTZ",
  icon: "hertz-network",
  rpc: [
    "https://mainnet-rpc.hertzscan.com",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Hertz",
    symbol: "HTZ",
    decimals: 18,
  },
  infoURL: "https://www.hertz-network.com",
  chainId: 26600,
  networkId: 26600,
  explorers: [
    {
      name: "Hertz Scan",
      url: "https://hertzscan.com",
      standard: "EIP3091",
    },
  ],
}
