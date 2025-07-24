/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_75 = {
  "name": "Decimal Smart Chain Mainnet",
  "shortName": "DSC",
  "chain": "DSC",
  "icon": "dsc",
  "rpc": [
    "https://node.decimalchain.com/web3/",
    "https://node1-mainnet.decimalchain.com/web3/",
    "https://node2-mainnet.decimalchain.com/web3/",
    "https://node3-mainnet.decimalchain.com/web3/",
    "https://node4-mainnet.decimalchain.com/web3/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Decimal",
    "symbol": "DEL",
    "decimals": 18
  },
  "infoURL": "https://decimalchain.com",
  "chainId": 75,
  "networkId": 75,
  "explorers": [
    {
      "name": "DSC Explorer Mainnet",
      "url": "https://explorer.decimalchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain