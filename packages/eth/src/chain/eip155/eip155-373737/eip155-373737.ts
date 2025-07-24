/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_373737 = {
  "name": "HAPchain Testnet",
  "shortName": "hap-testnet",
  "chain": "HAPchain",
  "icon": "hap",
  "rpc": [
    "https://jsonrpc-test.hap.land"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HAP",
    "symbol": "HAP",
    "decimals": 18
  },
  "infoURL": "https://hap.land",
  "chainId": 373737,
  "networkId": 373737,
  "slip44": 1,
  "explorers": [
    {
      "name": "HAP EVM Explorer (Blockscout)",
      "url": "https://blockscout-test.hap.land",
      "standard": "none"
    }
  ]
} satisfies Chain