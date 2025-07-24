/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1402 = {
  "name": "Polygon zkEVM Testnet old",
  "shortName": "zkevmtest",
  "title": "Polygon zkEVM Testnet",
  "chain": "Polygon",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "chainId": 1402,
  "networkId": 1402,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.public.zkevm-test.net",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain