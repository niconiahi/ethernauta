import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3701: Chain = {
  name: "Xpla Testnet",
  shortName: "xplatest",
  chain: "XPLATest",
  icon: "xpla",
  rpc: [
    "https://dimension-rpc.xpla.dev",
  ],
  faucets: [
    "https://faucet.xpla.io",
  ],
  nativeCurrency: {
    name: "XPLA",
    symbol: "XPLA",
    decimals: 18,
  },
  infoURL: "https://xpla.io",
  chainId: 3701,
  networkId: 3701,
  explorers: [
    {
      name: "XPLA Explorer",
      url: "https://explorer.xpla.io",
      standard: "none",
    },
  ],
  status: "deprecated",
}
