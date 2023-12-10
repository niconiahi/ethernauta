import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3966: Chain = {
  name: "DYNO Mainnet",
  shortName: "dyno",
  chain: "DYNO",
  rpc: [
    "https://api.dynoprotocol.com",
  ],
  faucets: [
    "https://faucet.dynoscan.io",
  ],
  nativeCurrency: {
    name: "DYNO Token",
    symbol: "DYNO",
    decimals: 18,
  },
  infoURL: "https://dynoprotocol.com",
  chainId: 3966,
  networkId: 3966,
  explorers: [
    {
      name: "DYNO Explorer",
      url: "https://dynoscan.io",
      standard: "EIP3091",
    },
  ],
}
