/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_162 = {
  "name": "Lightstreams Testnet",
  "shortName": "tpht",
  "chain": "PHT",
  "rpc": [
    "https://node.sirius.lightstreams.io"
  ],
  "faucets": [
    "https://discuss.lightstreams.network/t/request-test-tokens"
  ],
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "infoURL": "https://explorer.sirius.lightstreams.io",
  "chainId": 162,
  "networkId": 162,
  "slip44": 1
} satisfies Chain