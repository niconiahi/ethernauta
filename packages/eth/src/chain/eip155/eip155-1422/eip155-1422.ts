/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1422 = {
  "name": "Polygon zkEVM Testnet Pre Audit-Upgraded",
  "shortName": "testnet-zkEVM-mango-pre-audit-upgraded",
  "title": "Polygon zkEVM Testnet Pre Audit-Upgraded",
  "chain": "Polygon",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "chainId": 1422,
  "networkId": 1422,
  "slip44": 1,
  "explorers": [
    {
      "name": "Polygon zkEVM explorer",
      "url": "https://explorer.public.zkevm-test.net",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain