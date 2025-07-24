/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_444900 = {
  "name": "Weelink Testnet",
  "shortName": "wlkt",
  "chain": "WLK",
  "rpc": [
    "https://weelinknode1c.gw002.oneitfarm.com"
  ],
  "faucets": [
    "https://faucet.weelink.gw002.oneitfarm.com"
  ],
  "nativeCurrency": {
    "name": "Weelink Chain Token",
    "symbol": "tWLK",
    "decimals": 18
  },
  "infoURL": "https://weelink.cloud",
  "chainId": 444900,
  "networkId": 444900,
  "slip44": 1,
  "explorers": [
    {
      "name": "weelink-testnet",
      "url": "https://weelink.cloud/#/blockView/overview",
      "standard": "none"
    }
  ]
} satisfies Chain