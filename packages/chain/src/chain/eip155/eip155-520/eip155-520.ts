/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_520 = {
  "name": "XT Smart Chain Mainnet",
  "shortName": "xt",
  "chain": "XSC",
  "icon": "xsc",
  "rpc": [
    "https://datarpc1.xsc.pub",
    "https://datarpc2.xsc.pub",
    "https://datarpc3.xsc.pub"
  ],
  "faucets": [
    "https://xsc.pub/faucet"
  ],
  "nativeCurrency": {
    "name": "XT Smart Chain Native Token",
    "symbol": "XT",
    "decimals": 18
  },
  "infoURL": "https://xsc.pub/",
  "chainId": 520,
  "networkId": 1024,
  "explorers": [
    {
      "name": "xscscan",
      "url": "https://xscscan.pub",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain