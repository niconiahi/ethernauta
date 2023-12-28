/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_18 = {
  "name": "ThunderCore Testnet",
  "shortName": "TST",
  "chain": "TST",
  "rpc": [
    "https://testnet-rpc.thundercore.com"
  ],
  "faucets": [
    "https://faucet-testnet.thundercore.com"
  ],
  "nativeCurrency": {
    "name": "ThunderCore Testnet Token",
    "symbol": "TST",
    "decimals": 18
  },
  "infoURL": "https://thundercore.com",
  "chainId": 18,
  "networkId": 18,
  "slip44": 1,
  "explorers": [
    {
      "name": "thundercore-blockscout-testnet",
      "url": "https://explorer-testnet.thundercore.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain