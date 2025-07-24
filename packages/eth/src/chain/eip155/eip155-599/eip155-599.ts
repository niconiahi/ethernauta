/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_599 = {
  "name": "Metis Goerli Testnet",
  "shortName": "metis-goerli",
  "chain": "ETH",
  "rpc": [
    "https://goerli.gateway.metisdevops.link"
  ],
  "faucets": [
    "https://goerli.faucet.metisdevops.link"
  ],
  "nativeCurrency": {
    "name": "Goerli Metis",
    "symbol": "METIS",
    "decimals": 18
  },
  "infoURL": "https://www.metis.io",
  "chainId": 599,
  "networkId": 599,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://goerli.explorer.metisdevops.link",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://testnet-bridge.metis.io"
      }
    ]
  }
} satisfies Chain