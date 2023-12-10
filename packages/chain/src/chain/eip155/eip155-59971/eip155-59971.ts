import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_59971: Chain = {
  name: "Genesys Code Mainnet",
  shortName: "gcode",
  chain: "GCODE",
  icon: "genesyscode",
  rpc: [
    "https://mainnet.genesyscode.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "GenesysCode",
    symbol: "GCODE",
    decimals: 18,
  },
  infoURL: "https://genesyscode.io",
  chainId: 59971,
  networkId: 59971,
  explorers: [
    {
      name: "Genesys Scan",
      url: "https://genesysscan.io",
      standard: "none",
    },
  ],
}
