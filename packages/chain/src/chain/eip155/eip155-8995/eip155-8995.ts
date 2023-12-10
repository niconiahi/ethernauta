import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_8995: Chain = {
  name: "bloxberg",
  shortName: "berg",
  chain: "bloxberg",
  rpc: [
    "https://core.bloxberg.org",
  ],
  faucets: [
    "https://faucet.bloxberg.org/",
  ],
  nativeCurrency: {
    name: "BERG",
    symbol: "U+25B3",
    decimals: 18,
  },
  infoURL: "https://bloxberg.org",
  chainId: 8995,
  networkId: 8995,
}
