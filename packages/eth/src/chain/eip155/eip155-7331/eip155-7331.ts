/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7331 = {
  "name": "KLYNTAR",
  "shortName": "kly",
  "chain": "KLY",
  "icon": "klyntar",
  "rpc": [
    "https://evm.klyntar.org/kly_evm_rpc",
    "https://evm.klyntarscan.org/kly_evm_rpc"
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
    "name": "KLYNTAR",
    "symbol": "KLY",
    "decimals": 18
  },
  "infoURL": "https://klyntar.org",
  "chainId": 7331,
  "networkId": 7331,
  "explorers": [],
  "status": "incubating"
} satisfies Chain