/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_124 = {
  "name": "Decentralized Web Mainnet",
  "shortName": "dwu",
  "chain": "DWU",
  "rpc": [
    "https://decentralized-web.tech/dw_rpc.php"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Decentralized Web Utility",
    "symbol": "DWU",
    "decimals": 18
  },
  "infoURL": "https://decentralized-web.tech/dw_chain.php",
  "chainId": 124,
  "networkId": 124
} satisfies Chain