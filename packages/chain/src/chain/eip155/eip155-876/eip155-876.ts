/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_876 = {
  "name": "Bandai Namco Research Verse Mainnet",
  "shortName": "BNKEN",
  "chain": "Bandai Namco Research Verse",
  "icon": "bnken",
  "rpc": [
    "https://rpc.main.oasvrs.bnken.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://www.bandainamco-mirai.com/en/",
  "chainId": 876,
  "networkId": 876,
  "explorers": [
    {
      "name": "Bandai Namco Research Verse Explorer",
      "url": "https://explorer.main.oasvrs.bnken.net",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  }
} satisfies Chain