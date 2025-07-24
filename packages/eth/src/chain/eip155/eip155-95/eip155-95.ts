/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_95 = {
  "name": "CamDL Mainnet",
  "shortName": "camdl",
  "chain": "CADL",
  "icon": "camdl",
  "rpc": [
    "https://rpc1.camdl.gov.kh/"
  ],
  "faucets": [
    "https://faucet.camdl.gov.kh/"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "CADL",
    "symbol": "CADL",
    "decimals": 18
  },
  "infoURL": "https://camdl.gov.kh/",
  "chainId": 95,
  "networkId": 95,
  "explorers": [
    {
      "name": "CamDL Block Explorer",
      "url": "https://explorer.camdl.gov.kh",
      "standard": "EIP3091"
    }
  ],
  "status": "active",
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain