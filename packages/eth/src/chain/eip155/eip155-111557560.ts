/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_111557560 = {
  "name": "Cyber Testnet",
  "shortName": "cysep",
  "chain": "Cyber",
  "icon": "cyber",
  "rpc": [
    "https://cyber-testnet.alt.technology/",
    "wss://cyber-testnet.alt.technology/ws",
    "https://rpc.testnet.cyber.co/",
    "wss://rpc.testnet.cyber.co/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://cyber.co/",
  "chainId": 111557560,
  "networkId": 111557560,
  "explorers": [
    {
      "name": "Cyber Testnet Explorer",
      "url": "https://testnet.cyberscan.co",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://cyber-testnet.testnets.rollbridge.app/"
      }
    ]
  }
} satisfies Chain