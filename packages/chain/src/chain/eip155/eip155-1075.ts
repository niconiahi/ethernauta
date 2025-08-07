/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1075 = {
  "name": "IOTA EVM Testnet",
  "shortName": "iotaevm-testnet",
  "title": "IOTA EVM Testnet",
  "chain": "IOTA EVM",
  "icon": "iotaevm",
  "rpc": [
    "https://json-rpc.evm.testnet.iotaledger.net"
  ],
  "faucets": [
    "https://evm-toolkit.evm.testnet.iotaledger.net"
  ],
  "nativeCurrency": {
    "name": "IOTA",
    "symbol": "IOTA",
    "decimals": 18
  },
  "infoURL": "https://www.iota.org",
  "chainId": 1075,
  "networkId": 1075,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.testnet.iotaledger.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain