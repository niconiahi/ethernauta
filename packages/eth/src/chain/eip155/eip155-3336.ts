/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3336 = {
  "name": "EthStorage L2 Testnet",
  "shortName": "esl2-t",
  "chain": "EthStorage",
  "rpc": [
    "http://testnet.l2.ethstorage.io:9540"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ethstorage.io/",
  "chainId": 3336,
  "networkId": 3336,
  "slip44": 1,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "status": "incubating"
} satisfies Chain