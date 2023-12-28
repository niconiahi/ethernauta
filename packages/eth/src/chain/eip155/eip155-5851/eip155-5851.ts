/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5851 = {
  "name": "Ontology Testnet",
  "shortName": "OntologyTestnet",
  "chain": "Ontology",
  "icon": "ontology",
  "rpc": [
    "http://polaris1.ont.io:20339",
    "http://polaris2.ont.io:20339",
    "http://polaris3.ont.io:20339",
    "http://polaris4.ont.io:20339",
    "https://polaris1.ont.io:10339",
    "https://polaris2.ont.io:10339",
    "https://polaris3.ont.io:10339",
    "https://polaris4.ont.io:10339"
  ],
  "faucets": [
    "https://developer.ont.io/"
  ],
  "nativeCurrency": {
    "name": "ONG",
    "symbol": "ONG",
    "decimals": 18
  },
  "infoURL": "https://ont.io/",
  "chainId": 5851,
  "networkId": 5851,
  "slip44": 1,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.ont.io/testnet",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain