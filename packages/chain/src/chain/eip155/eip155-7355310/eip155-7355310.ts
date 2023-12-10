import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_7355310: Chain = {
  name: "OpenVessel",
  shortName: "vsl",
  chain: "VSL",
  icon: "vsl",
  rpc: [
    "https://mainnet-external.openvessel.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Vessel ETH",
    symbol: "VETH",
    decimals: 18,
  },
  infoURL: "https://www.openvessel.io",
  chainId: 7355310,
  networkId: 7355310,
  explorers: [
    {
      name: "openvessel-mainnet",
      url: "https://mainnet-explorer.openvessel.io",
      standard: "none",
    },
  ],
}
