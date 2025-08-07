/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4422 = {
  "name": "Testnet Pika",
  "shortName": "PikaMinter",
  "chain": "tPKA",
  "icon": "testnetpsc",
  "rpc": [
    "https://testnet-rpc1.pikascan.com"
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
    "name": "Testnet Pika",
    "symbol": "tPKA",
    "decimals": 18
  },
  "infoURL": "https://pikaminter.com",
  "chainId": 4422,
  "networkId": 4422,
  "explorers": []
} satisfies Chain