/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10920 = {
  "name": "Fuse Flash Testnet",
  "shortName": "fuseflash",
  "chain": "Fuse Flash",
  "icon": "fuse",
  "rpc": [],
  "faucets": [
    "https://faucet.quicknode.com"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Fuse",
    "symbol": "FUSE",
    "decimals": 18
  },
  "infoURL": "https://www.fuse.io",
  "chainId": 10920,
  "networkId": 10920,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "status": "incubating"
} satisfies Chain