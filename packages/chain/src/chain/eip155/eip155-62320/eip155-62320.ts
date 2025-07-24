/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_62320 = {
  "name": "Celo Baklava Testnet",
  "shortName": "BKLV",
  "chain": "CELO",
  "rpc": [
    "https://baklava-forno.celo-testnet.org"
  ],
  "faucets": [
    "https://docs.google.com/forms/d/e/1FAIpQLSdfr1BwUTYepVmmvfVUDRCwALejZ-TUva2YujNpvrEmPAX2pg/viewform",
    "https://cauldron.pretoriaresearchlab.io/baklava-faucet"
  ],
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "infoURL": "https://docs.celo.org/",
  "chainId": 62320,
  "networkId": 62320,
  "slip44": 1
} satisfies Chain