/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_22040 = {
  "name": "AirDAO Testnet",
  "shortName": "airdao-test",
  "chain": "ambnet-test",
  "icon": "airdao",
  "rpc": [
    "https://network.ambrosus-test.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "infoURL": "https://testnet.airdao.io",
  "chainId": 22040,
  "networkId": 22040,
  "slip44": 1,
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://testnet.airdao.io/explorer",
      "standard": "none"
    }
  ]
} satisfies Chain