/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9996 = {
  "name": "Mind Smart Chain Mainnet",
  "shortName": "MIND",
  "chain": "MIND",
  "icon": "mindchain",
  "rpc": [
    "https://rpc-msc.mindchain.info/",
    "https://seednode.mindchain.info",
    "https://archive.mindchain.info/",
    "https://mind-smart-chain.rpc.thirdweb.com",
    "wss://archive.mindchain.info/ws",
    "wss://seednode.mindchain.info/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MIND Coin",
    "symbol": "MIND",
    "decimals": 18
  },
  "infoURL": "https://mindchain.info",
  "chainId": 9996,
  "networkId": 9996,
  "explorers": [
    {
      "name": "Mind Chain explorer",
      "url": "https://mainnet.mindscan.info",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain