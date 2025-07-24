/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_246785 = {
  "name": "ARTIS Testnet tau1",
  "shortName": "atstau",
  "chain": "ARTIS",
  "rpc": [
    "https://rpc.tau1.artis.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ARTIS tau1 Ether",
    "symbol": "tATS",
    "decimals": 18
  },
  "infoURL": "https://artis.network",
  "chainId": 246785,
  "networkId": 246785,
  "slip44": 1
} satisfies Chain