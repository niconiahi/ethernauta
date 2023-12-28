/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_868 = {
  "name": "Fantasia Chain Mainnet",
  "shortName": "FSCMainnet",
  "chain": "FSC",
  "rpc": [
    "https://mainnet-data1.fantasiachain.com/",
    "https://mainnet-data2.fantasiachain.com/",
    "https://mainnet-data3.fantasiachain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FST",
    "symbol": "FST",
    "decimals": 18
  },
  "infoURL": "https://fantasiachain.com/",
  "chainId": 868,
  "networkId": 868,
  "explorers": [
    {
      "name": "FSCScan",
      "url": "https://explorer.fantasiachain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain