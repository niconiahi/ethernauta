import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_15551: Chain = {
  name: "LoopNetwork Mainnet",
  shortName: "loop",
  chain: "LoopNetwork",
  rpc: [
    "https://api.mainnetloop.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "LOOP",
    symbol: "LOOP",
    decimals: 18,
  },
  infoURL: "http://theloopnetwork.org/",
  chainId: 15551,
  networkId: 15551,
  explorers: [
    {
      name: "loopscan",
      url: "http://explorer.mainnetloop.com",
      standard: "none",
    },
  ],
}
