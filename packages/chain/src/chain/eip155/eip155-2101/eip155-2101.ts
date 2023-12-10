import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2101: Chain = {
  name: "Ecoball Testnet Espuma",
  shortName: "esp",
  chain: "ECO",
  rpc: [
    "https://api.ecoball.org/espuma/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Espuma Coin",
    symbol: "ECO",
    decimals: 18,
  },
  infoURL: "https://ecoball.org",
  chainId: 2101,
  networkId: 2101,
  explorers: [
    {
      name: "Ecoball Testnet Explorer",
      url: "https://espuma-scan.ecoball.org",
      standard: "EIP3091",
    },
  ],
}
