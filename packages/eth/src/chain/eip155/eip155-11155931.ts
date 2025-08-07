/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11155931 = {
  "name": "RISE Testnet",
  "shortName": "rise-testnet",
  "chain": "ETH",
  "icon": "rise",
  "rpc": [
    "https://testnet.riselabs.xyz",
    "wss://testnet.riselabs.xyz/ws"
  ],
  "faucets": [
    "https://faucet.testnet.riselabs.xyz"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "RISE Testnet Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.riselabs.xyz/",
  "chainId": 11155931,
  "networkId": 11155931,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.testnet.riselabs.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge-ui.testnet.riselabs.xyz"
      }
    ]
  }
} satisfies Chain