/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_666666 = {
  "name": "Vision - Vpioneer Test Chain",
  "shortName": "vpioneer",
  "chain": "Vision-Vpioneer",
  "rpc": [
    "https://vpioneer.infragrid.v.network/ethereum/compatible"
  ],
  "faucets": [
    "https://vpioneerfaucet.visionscan.org"
  ],
  "nativeCurrency": {
    "name": "VS",
    "symbol": "VS",
    "decimals": 18
  },
  "infoURL": "https://visionscan.org",
  "chainId": 666666,
  "networkId": 666666,
  "slip44": 1
} satisfies Chain