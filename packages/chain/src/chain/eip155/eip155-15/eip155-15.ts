/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_15 = {
  "name": "Diode Prenet",
  "shortName": "diode",
  "chain": "DIODE",
  "rpc": [
    "https://prenet.diode.io:8443/",
    "wss://prenet.diode.io:8443/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Diodes",
    "symbol": "DIODE",
    "decimals": 18
  },
  "infoURL": "https://diode.io/prenet",
  "chainId": 15,
  "networkId": 15
} satisfies Chain