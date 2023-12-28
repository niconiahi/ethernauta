/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_211 = {
  "name": "Freight Trust Network",
  "shortName": "EDI",
  "chain": "EDI",
  "rpc": [
    "http://13.57.207.168:3435",
    "https://app.freighttrust.net/ftn/${API_KEY}"
  ],
  "faucets": [
    "http://faucet.freight.sh"
  ],
  "nativeCurrency": {
    "name": "Freight Trust Native",
    "symbol": "0xF",
    "decimals": 18
  },
  "infoURL": "https://freighttrust.com",
  "chainId": 211,
  "networkId": 0
} satisfies Chain