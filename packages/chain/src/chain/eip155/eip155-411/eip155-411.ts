import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_411: Chain = {
  name: "Pepe Chain Mainnet",
  shortName: "pepe",
  chain: "PC",
  icon: "pepechain",
  rpc: [
    "https://rpc.pepe-chain.vip",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Pepe",
    symbol: "PEPE",
    decimals: 18,
  },
  infoURL: "https://pepe-chain.vip",
  chainId: 411,
  networkId: 411,
  explorers: [
    {
      name: "pepechain explorer",
      url: "https://explorer.pepe-chain.vip",
      standard: "EIP3091",
    },
  ],
  status: "active",
}
