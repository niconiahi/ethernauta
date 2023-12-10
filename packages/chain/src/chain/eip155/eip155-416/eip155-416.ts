import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_416: Chain = {
  name: "SX Network Mainnet",
  shortName: "SX",
  chain: "SX",
  icon: "SX",
  rpc: [
    "https://rpc.sx.technology",
  ],
  faucets: [],
  nativeCurrency: {
    name: "SX Network",
    symbol: "SX",
    decimals: 18,
  },
  infoURL: "https://www.sx.technology",
  chainId: 416,
  networkId: 416,
  explorers: [
    {
      name: "SX Network Explorer",
      url: "https://explorer.sx.technology",
      standard: "EIP3091",
    },
  ],
}
