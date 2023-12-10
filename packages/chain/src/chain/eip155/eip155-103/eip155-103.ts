import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_103: Chain = {
  name: "Worldland Mainnet",
  shortName: "WLC",
  chain: "Worldland",
  icon: "worldland",
  rpc: [
    "https://seoul.worldland.foundation",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Worldland",
    symbol: "WL",
    decimals: 18,
  },
  infoURL: "https://worldland.foundation",
  chainId: 103,
  networkId: 103,
  explorers: [
    {
      name: "Worldland Explorer",
      url: "https://scan.worldland.foundation",
      standard: "EIP3091",
    },
  ],
}
