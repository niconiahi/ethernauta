/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_96969696 = {
  "name": " Privix Chain Testnet",
  "shortName": "tpsc",
  "chain": "PRIVIX",
  "icon": "privix",
  "rpc": [
    "https://testnet-rpc.privixchain.xyz/",
    "wss://testnet-rpc.privixchain.xyz/ws"
  ],
  "faucets": [
    "https://faucet.privixchain.xyz"
  ],
  "nativeCurrency": {
    "name": "Privix Coin",
    "symbol": "PRIVIX",
    "decimals": 18
  },
  "infoURL": "https://privix.co/",
  "chainId": 96969696,
  "networkId": 96969696,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.privixscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain