/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_810182 = {
  "name": "zkLink Nova Goerli Testnet",
  "shortName": "zklink-nova-goerli",
  "chain": "ETH",
  "icon": "zklink-nova",
  "rpc": [
    "https://goerli.rpc.zklink.io",
    "wss://goerli.rpc.zklink.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zklink.io",
  "chainId": 810182,
  "networkId": 810182,
  "slip44": 1,
  "explorers": [
    {
      "name": "zkLink Nova Block Explorer",
      "url": "https://goerli.explorer.zklink.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-59140",
    "bridges": [
      {
        "url": "https://goerli.portal.zklink.io"
      }
    ]
  }
} satisfies Chain