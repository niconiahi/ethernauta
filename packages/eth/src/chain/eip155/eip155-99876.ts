/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_99876 = {
  "name": "Edge Matrix Chain Testnet",
  "shortName": "EMCTestnet",
  "chain": "EMC Testnet",
  "icon": "emctest",
  "rpc": [
    "https://rpc1-testnet.emc.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Edge Matrix Chain Token",
    "symbol": "EMC",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 99876,
  "networkId": 99876,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.emcscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain