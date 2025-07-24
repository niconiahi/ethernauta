/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_622277 = {
  "name": "Hypra Mainnet",
  "shortName": "hyp",
  "chain": "HYP",
  "icon": "rethereum",
  "rpc": [
    "https://rpc.hypra.network",
    "https://rpc.rethereum.org",
    "https://rethereum.rpc.restratagem.com",
    "https://rpc.rthcentral.org",
    "https://hypra.rpc.thirdweb.com"
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
    "name": "Hypra",
    "symbol": "HYP",
    "decimals": 18
  },
  "infoURL": "https://www.hypra.network",
  "chainId": 622277,
  "networkId": 622277,
  "explorers": [
    {
      "name": "hypra",
      "url": "https://explorer.hypra.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain