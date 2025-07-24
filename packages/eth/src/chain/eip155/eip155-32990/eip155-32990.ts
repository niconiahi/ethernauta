/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_32990 = {
  "name": "Zilliqa EVM Isolated Server",
  "shortName": "zil-isolated-server",
  "chain": "ZIL",
  "icon": "zilliqa",
  "rpc": [
    "https://zilliqa-isolated-server.zilliqa.com/"
  ],
  "faucets": [
    "https://dev-wallet.zilliqa.com/faucet?network=isolated_server"
  ],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "chainId": 32990,
  "networkId": 32990,
  "explorers": [
    {
      "name": "Zilliqa EVM Isolated Server Explorer",
      "url": "https://devex.zilliqa.com/?network=https://zilliqa-isolated-server.zilliqa.com",
      "standard": "none"
    }
  ]
} satisfies Chain