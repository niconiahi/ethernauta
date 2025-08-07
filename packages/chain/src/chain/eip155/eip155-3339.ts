/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3339 = {
  "name": "EthStorage Mainnet",
  "shortName": "es-m",
  "chain": "EthStorage",
  "rpc": [
    "http://mainnet.ethstorage.io:9540"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ethstorage.io/",
  "chainId": 3339,
  "networkId": 3339,
  "slip44": 1,
  "status": "incubating"
} satisfies Chain