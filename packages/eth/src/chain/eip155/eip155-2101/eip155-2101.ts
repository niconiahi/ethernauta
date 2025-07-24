/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2101 = {
  "name": "Ecoball Testnet Espuma",
  "shortName": "esp",
  "chain": "ECO",
  "rpc": [
    "https://api.ecoball.org/espuma/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Espuma Coin",
    "symbol": "ECO",
    "decimals": 18
  },
  "infoURL": "https://ecoball.org",
  "chainId": 2101,
  "networkId": 2101,
  "slip44": 1,
  "explorers": [
    {
      "name": "Ecoball Testnet Explorer",
      "url": "https://espuma-scan.ecoball.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain