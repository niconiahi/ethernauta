/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_32323 = {
  "name": "BasedAI",
  "shortName": "basedai",
  "title": "BasedAI",
  "chain": "BasedAI",
  "icon": "basedai",
  "rpc": [
    "https://mainnet.basedaibridge.com/rpc/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "BasedAI",
    "symbol": "BASED",
    "decimals": 18
  },
  "infoURL": "https://getbased.ai",
  "chainId": 32323,
  "networkId": 32323,
  "explorers": [
    {
      "name": "BasedAI Explorer",
      "url": "https://explorer.getbased.ai",
      "standard": "none"
    },
    {
      "name": "BF1337 BasedAI Explorer",
      "url": "https://explorer.bf1337.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain