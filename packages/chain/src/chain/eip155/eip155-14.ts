/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_14 = {
  "name": "Flare Mainnet",
  "shortName": "flr",
  "chain": "FLR",
  "icon": "flare",
  "rpc": [
    "https://flare-api.flare.network/ext/C/rpc",
    "https://flare.rpc.thirdweb.com",
    "https://flare-bundler.etherspot.io",
    "https://rpc.ankr.com/flare",
    "https://01-gravelines-003-01.rpc.tatum.io/ext/bc/C/rpc",
    "https://01-vinthill-003-02.rpc.tatum.io/ext/bc/C/rpc",
    "https://rpc.au.cc/flare",
    "https://flare.enosys.global/ext/C/rpc",
    "https://flare.solidifi.app/ext/C/rpc"
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
    "name": "Flare",
    "symbol": "FLR",
    "decimals": 18
  },
  "infoURL": "https://flare.network",
  "chainId": 14,
  "networkId": 14,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://flare-explorer.flare.network",
      "standard": "EIP3091"
    },
    {
      "name": "Routescan",
      "url": "https://mainnet.flarescan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain