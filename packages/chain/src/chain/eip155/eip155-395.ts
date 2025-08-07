/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_395 = {
  "name": "CamDL Testnet",
  "shortName": "camdl-testnet",
  "chain": "CADL",
  "icon": "camdl",
  "rpc": [
    "https://rpc1.testnet.camdl.gov.kh/"
  ],
  "faucets": [
    "https://faucet.testnet.camdl.gov.kh/"
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
  "chainId": 395,
  "networkId": 395,
  "explorers": [
    {
      "name": "CamDL Testnet Explorer",
      "url": "https://explorer.testnet.camdl.gov.kh",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain