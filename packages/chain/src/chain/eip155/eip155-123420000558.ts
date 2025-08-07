/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_123420000558 = {
  "name": "PIN",
  "shortName": "PIN",
  "title": "PIN",
  "chain": "PIN",
  "rpc": [
    "https://rpc.pin.t.raas.gelato.cloud",
    "wss://ws.pin.t.raas.gelato.cloud"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/pin",
  "chainId": 123420000558,
  "networkId": 123420000558,
  "slip44": 60,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.pin.t.raas.gelato.cloud",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://testnet-bridge.gelato.network/bridge/pin/bridge/pin"
      }
    ]
  }
} satisfies Chain