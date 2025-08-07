/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_21000001 = {
  "name": "Corn Testnet",
  "shortName": "corn-testnet",
  "chain": "BTCN",
  "rpc": [
    "https://testnet.corn-rpc.com",
    "https://rpc.ankr.com/corn_testnet",
    "https://testnet-rpc.usecorn.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcorn",
    "symbol": "BTCN",
    "decimals": 18
  },
  "infoURL": "https://usecorn.com",
  "chainId": 21000001,
  "networkId": 21000001,
  "explorers": [
    {
      "name": "Corn Testnet Explorer",
      "url": "https://testnet.cornscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "Corn Testnet Blockscout",
      "url": "https://testnet-explorer.usecorn.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  }
} satisfies Chain