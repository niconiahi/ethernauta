import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1024: Chain = {
  name: "CLV Parachain",
  shortName: "clv",
  chain: "CLV",
  rpc: [
    "https://api-para.clover.finance",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CLV",
    symbol: "CLV",
    decimals: 18,
  },
  infoURL: "https://clv.org",
  chainId: 1024,
  networkId: 1024,
}
