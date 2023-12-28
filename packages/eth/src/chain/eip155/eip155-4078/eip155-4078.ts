/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4078 = {
  "name": "Muster Mainnet",
  "shortName": "muster",
  "chain": "Muster",
  "icon": "muster",
  "rpc": [
    "https://muster.alt.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 4078,
  "networkId": 4078,
  "explorers": [
    {
      "name": "Musterscan",
      "url": "https://muster-explorer.alt.technology",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": []
  }
} satisfies Chain