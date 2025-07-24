/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_200 = {
  "name": "Arbitrum on xDai",
  "shortName": "aox",
  "chain": "AOX",
  "rpc": [
    "https://arbitrum.xdaichain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "xDAI",
    "symbol": "xDAI",
    "decimals": 18
  },
  "infoURL": "https://xdaichain.com",
  "chainId": 200,
  "networkId": 200,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/xdai/arbitrum",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-100"
  }
} satisfies Chain