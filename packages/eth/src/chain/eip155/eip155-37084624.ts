/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_37084624 = {
  "name": "SKALE Nebula Hub Testnet",
  "shortName": "nebula-testnet",
  "title": "SKALE Nebula Hub Testnet",
  "chain": "lanky-ill-funny-testnet",
  "icon": "nebula",
  "rpc": [
    "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet",
    "wss://testnet.skalenodes.com/v1/ws/lanky-ill-funny-testnet"
  ],
  "faucets": [
    "https://www.sfuelstation.com/"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://nebulachain.io/",
  "chainId": 37084624,
  "networkId": 37084624,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain