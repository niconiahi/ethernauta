import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_6999: Chain = {
  name: "PolySmartChain",
  shortName: "psc",
  chain: "PSC",
  rpc: [
    "https://seed0.polysmartchain.com/",
    "https://seed1.polysmartchain.com/",
    "https://seed2.polysmartchain.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "PSC",
    symbol: "PSC",
    decimals: 18,
  },
  infoURL: "https://www.polysmartchain.com/",
  chainId: 6999,
  networkId: 6999,
}
