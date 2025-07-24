/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_534353 = {
  "name": "Scroll Alpha Testnet",
  "shortName": "scr-alpha",
  "chain": "ETH",
  "rpc": [
    "https://alpha-rpc.scroll.io/l2"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "chainId": 534353,
  "networkId": 534353,
  "slip44": 1,
  "explorers": [
    {
      "name": "Scroll Alpha Testnet Block Explorer",
      "url": "https://alpha-blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": []
  },
  "status": "deprecated"
} satisfies Chain