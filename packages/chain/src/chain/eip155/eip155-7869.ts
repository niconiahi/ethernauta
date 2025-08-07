/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7869 = {
  "name": "Powerloom Mainnet V2",
  "shortName": "powerloom",
  "chain": "Powerloom Mainnet V2",
  "icon": "power",
  "rpc": [
    "https://rpc-v2.powerloom.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Powerloom Token",
    "symbol": "POWER",
    "decimals": 18
  },
  "infoURL": "https://powerloom.network",
  "chainId": 7869,
  "networkId": 7869,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-v2.powerloom.network",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain