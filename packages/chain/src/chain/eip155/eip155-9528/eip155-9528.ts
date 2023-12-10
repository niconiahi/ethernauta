import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_9528: Chain = {
  name: "QEasyWeb3 Testnet",
  shortName: "QETTest",
  chain: "QET",
  rpc: [
    "https://qeasyweb3.com",
  ],
  faucets: [
    "http://faucet.qeasyweb3.com",
  ],
  nativeCurrency: {
    name: "QET",
    symbol: "QET",
    decimals: 18,
  },
  infoURL: "https://www.qeasyweb3.com",
  chainId: 9528,
  networkId: 9528,
  explorers: [
    {
      name: "QEasyWeb3 Explorer",
      url: "https://www.qeasyweb3.com",
      standard: "EIP3091",
    },
  ],
}
