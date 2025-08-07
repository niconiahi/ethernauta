/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8886 = {
  "name": "Avenium Testnet",
  "shortName": "tave",
  "chain": "AVE",
  "icon": "avenium",
  "rpc": [
    "https://eu-testnet.avenium.io/",
    "https://connect-testnet.avenium.io"
  ],
  "faucets": [
    "https://faucet-testnet.avenium.io"
  ],
  "nativeCurrency": {
    "name": "Ave Native Token",
    "symbol": "tAVE",
    "decimals": 18
  },
  "infoURL": "https://avenium.io",
  "chainId": 8886,
  "networkId": 8886,
  "explorers": [
    {
      "name": "Avenium Explorer Testnet",
      "url": "https://testnet.avescan.net",
      "standard": "none"
    }
  ],
  "status": "incubating"
} satisfies Chain