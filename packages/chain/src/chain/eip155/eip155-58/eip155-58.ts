/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_58 = {
  "name": "Ontology Mainnet",
  "shortName": "OntologyMainnet",
  "chain": "Ontology",
  "icon": "ontology",
  "rpc": [
    "http://dappnode1.ont.io:20339",
    "http://dappnode2.ont.io:20339",
    "http://dappnode3.ont.io:20339",
    "http://dappnode4.ont.io:20339",
    "https://dappnode1.ont.io:10339",
    "https://dappnode2.ont.io:10339",
    "https://dappnode3.ont.io:10339",
    "https://dappnode4.ont.io:10339"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONG",
    "symbol": "ONG",
    "decimals": 18
  },
  "infoURL": "https://ont.io/",
  "chainId": 58,
  "networkId": 58,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.ont.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain