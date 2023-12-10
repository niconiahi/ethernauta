import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_10823: Chain = {
  name: "CryptoCoinPay",
  shortName: "CCP",
  chain: "CCP",
  icon: "ccp",
  rpc: [
    "http://node106.cryptocoinpay.info:8545",
    "ws://node106.cryptocoinpay.info:8546",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CryptoCoinPay",
    symbol: "CCP",
    decimals: 18,
  },
  infoURL: "https://www.cryptocoinpay.co",
  chainId: 10823,
  networkId: 10823,
  explorers: [
    {
      name: "CCP Explorer",
      url: "https://cryptocoinpay.info",
      standard: "EIP3091",
    },
  ],
}
