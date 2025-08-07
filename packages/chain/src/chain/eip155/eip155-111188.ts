/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_111188 = {
  "name": "re.al",
  "shortName": "re-al",
  "title": "re.al Real-World Assets network",
  "chain": "re.al",
  "icon": "real",
  "rpc": [
    "https://rpc.realforreal.gelato.digital",
    "wss://ws.realforreal.gelato.digital",
    "https://tangible-real.gateway.tenderly.co",
    "https://real.drpc.org",
    "wss://real.drpc.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "re.al Ether",
    "symbol": "reETH",
    "decimals": 18
  },
  "infoURL": "https://re.al",
  "chainId": 111188,
  "networkId": 111188,
  "slip44": 60,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.re.al",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://re.al/bridge"
      },
      {
        "url": "https://bridge.gelato.network/bridge/real"
      }
    ]
  }
} satisfies Chain