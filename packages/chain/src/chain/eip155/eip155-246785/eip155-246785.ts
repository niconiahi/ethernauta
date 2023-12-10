import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_246785: Chain = {
  name: "ARTIS Testnet tau1",
  shortName: "atstau",
  chain: "ARTIS",
  rpc: [
    "https://rpc.tau1.artis.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ARTIS tau1 Ether",
    symbol: "tATS",
    decimals: 18,
  },
  infoURL: "https://artis.network",
  chainId: 246785,
  networkId: 246785,
}
