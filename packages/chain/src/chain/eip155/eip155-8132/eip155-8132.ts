import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_8132: Chain = {
  name: "Qitmeer Network Mixnet",
  shortName: "meermix",
  chain: "MEER",
  icon: "meer",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Qitmeer Mixnet",
    symbol: "MEER-M",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 8132,
  networkId: 8132,
  status: "incubating",
}
