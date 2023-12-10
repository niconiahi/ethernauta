import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_8029: Chain = {
  name: "MDGL Testnet",
  shortName: "mdgl",
  chain: "MDGL",
  rpc: [
    "https://testnet.mdgl.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MDGL Token",
    symbol: "MDGLT",
    decimals: 18,
  },
  infoURL: "https://mdgl.io",
  chainId: 8029,
  networkId: 8029,
}
