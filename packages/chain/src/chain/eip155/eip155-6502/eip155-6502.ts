import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_6502: Chain = {
  name: "Peerpay",
  shortName: "Peerpay",
  chain: "P2P",
  rpc: [
    "https://peerpay.su.gy/p2p",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Peerpay",
    symbol: "P2P",
    decimals: 18,
  },
  infoURL: "https://peerpay.su.gy",
  chainId: 6502,
  networkId: 6502,
  explorers: [],
}
