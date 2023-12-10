import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2100: Chain = {
  name: "Ecoball Mainnet",
  shortName: "eco",
  chain: "ECO",
  rpc: [
    "https://api.ecoball.org/ecoball/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ecoball Coin",
    symbol: "ECO",
    decimals: 18,
  },
  infoURL: "https://ecoball.org",
  chainId: 2100,
  networkId: 2100,
  explorers: [
    {
      name: "Ecoball Explorer",
      url: "https://scan.ecoball.org",
      standard: "EIP3091",
    },
  ],
}
