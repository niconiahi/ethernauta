/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_59140 = {
  "name": "Linea Testnet",
  "shortName": "linea-testnet",
  "title": "Linea Goerli Testnet",
  "chain": "ETH",
  "icon": "linea",
  "rpc": [
    "https://rpc.goerli.linea.build",
    "wss://rpc.goerli.linea.build",
    "https://linea-goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-goerli.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "faucets": [
    "https://faucetlink.to/goerli"
  ],
  "nativeCurrency": {
    "name": "Linea Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://linea.build",
  "chainId": 59140,
  "networkId": 59140,
  "slip44": 1,
  "explorers": [
    {
      "name": "Etherscan",
      "url": "https://goerli.lineascan.build",
      "standard": "EIP3091"
    },
    {
      "name": "Blockscout",
      "url": "https://explorer.goerli.linea.build",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://goerli.hop.exchange/#/send?token=ETH&sourceNetwork=ethereum&destNetwork=linea"
      }
    ]
  },
  "status": "active"
} satisfies Chain