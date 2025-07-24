/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2046399126 = {
  "name": "SKALE Europa Hub",
  "shortName": "europa",
  "chain": "europa",
  "icon": "europa",
  "rpc": [
    "https://mainnet.skalenodes.com/v1/elated-tan-skat",
    "wss://mainnet.skalenodes.com/v1/elated-tan-skat"
  ],
  "faucets": [
    "https://ruby.exchange/faucet.html",
    "https://sfuel.mylilius.com/"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://europahub.network/",
  "chainId": 2046399126,
  "networkId": 2046399126,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://elated-tan-skat.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://ruby.exchange/bridge.html"
      }
    ]
  }
} satisfies Chain