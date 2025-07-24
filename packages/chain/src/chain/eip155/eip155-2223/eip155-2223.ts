/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2223 = {
  "name": "VChain Mainnet",
  "shortName": "VChain",
  "chain": "VChain",
  "rpc": [
    "https://bc.vcex.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "VNDT",
    "symbol": "VNDT",
    "decimals": 18
  },
  "infoURL": "https://bo.vcex.xyz/",
  "chainId": 2223,
  "networkId": 2223,
  "explorers": [
    {
      "name": "VChain Scan",
      "url": "https://scan.vcex.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain