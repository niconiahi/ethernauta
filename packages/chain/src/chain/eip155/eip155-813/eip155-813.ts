/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_813 = {
  "name": "Qitmeer",
  "shortName": "meer",
  "chain": "MEER",
  "icon": "meer",
  "rpc": [
    "https://evm-dataseed1.meerscan.io",
    "https://evm-dataseed2.meerscan.io",
    "https://evm-dataseed3.meerscan.io",
    "https://evm-dataseed.meerscan.com",
    "https://evm-dataseed1.meerscan.com",
    "https://evm-dataseed2.meerscan.com",
    "https://qng.rpc.qitmeer.io",
    "https://mainnet.meerlabs.com",
    "https://rpc.dimai.ai",
    "https://rpc.woowow.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Qitmeer",
    "symbol": "MEER",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "chainId": 813,
  "networkId": 813,
  "slip44": 813,
  "explorers": [
    {
      "name": "meerscan",
      "url": "https://qng.meerscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain