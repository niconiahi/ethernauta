import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_927: Chain = {
  name: "Yidark Chain Mainnet",
  shortName: "ydk",
  chain: "Yidark",
  icon: "ydk",
  rpc: [
    "https://rpc.yidark.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Yidark",
    symbol: "YDK",
    decimals: 18,
  },
  infoURL: "https://yidarkscan.com",
  chainId: 927,
  networkId: 927,
  explorers: [
    {
      name: "Yidarkscan",
      url: "https://yidarkscan.com",
      standard: "EIP3091",
    },
  ],
}
