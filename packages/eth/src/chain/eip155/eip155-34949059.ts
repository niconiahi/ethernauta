/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_34949059 = {
  "name": "citronus-citro",
  "shortName": "citronus-citro",
  "title": "Citronus-Citro",
  "chain": "citronus-citro",
  "rpc": [
    "https://rpc.citro-testnet.t.raas.gelato.cloud",
    "wss://testnet-ws.eh-dev.app"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Citronus",
    "symbol": "CITRO",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/citronus-citro",
  "chainId": 34949059,
  "networkId": 34949059,
  "slip44": 60,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://test.citronus.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://testnet-bridge.gelato.network/bridge/citronus-citro"
      }
    ]
  },
  "status": "active"
} satisfies Chain