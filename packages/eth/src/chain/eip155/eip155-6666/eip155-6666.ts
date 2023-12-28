/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6666 = {
  "name": "Cybria Testnet",
  "shortName": "tcyba",
  "chain": "CYBA",
  "icon": "cybria",
  "rpc": [
    "https://l2-rpc.cybascan.io"
  ],
  "faucets": [
    "https://faucet.cybascan.io"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Cybria",
    "symbol": "CYBA",
    "decimals": 18
  },
  "infoURL": "https://cybria.io",
  "chainId": 6666,
  "networkId": 6666,
  "explorers": [
    {
      "name": "Cybria Explorer",
      "url": "https://explorer.cybascan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155420",
    "bridges": [
      {
        "url": "https://app.optimism.io/bridge"
      }
    ]
  }
} satisfies Chain