import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_121: Chain = {
  name: "Realchain Mainnet",
  shortName: "REAL",
  chain: "REAL",
  rpc: [
    "https://rcl-dataseed1.rclsidechain.com",
    "https://rcl-dataseed2.rclsidechain.com",
    "https://rcl-dataseed3.rclsidechain.com",
    "https://rcl-dataseed4.rclsidechain.com",
    "wss://rcl-dataseed1.rclsidechain.com/v1/",
    "wss://rcl-dataseed2.rclsidechain.com/v1/",
    "wss://rcl-dataseed3.rclsidechain.com/v1/",
    "wss://rcl-dataseed4.rclsidechain.com/v1/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Realchain",
    symbol: "REAL",
    decimals: 18,
  },
  infoURL: "https://www.rclsidechain.com/",
  chainId: 121,
  networkId: 121,
  slip44: 714,
  explorers: [
    {
      name: "realscan",
      url: "https://rclscan.com",
      standard: "EIP3091",
    },
  ],
}
