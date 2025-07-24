/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2203181 = {
  "name": "PlatON Dev Testnet Deprecated",
  "shortName": "platondev",
  "chain": "PlatON",
  "icon": "platon",
  "rpc": [
    "https://devnetopenapi2.platon.network/rpc",
    "wss://devnetopenapi2.platon.network/ws"
  ],
  "faucets": [
    "https://devnet2faucet.platon.network/faucet"
  ],
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "infoURL": "https://www.platon.network",
  "chainId": 2203181,
  "networkId": 1,
  "slip44": 1,
  "explorers": [
    {
      "name": "PlatON explorer",
      "url": "https://devnetscan.platon.network",
      "standard": "none"
    }
  ],
  "status": "deprecated"
} satisfies Chain