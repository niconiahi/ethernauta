/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_234 = {
  "name": "ProtoJumbo Testnet",
  "shortName": "ProtoJumbo",
  "chain": "Jumbo",
  "rpc": [
    "https://testnode.jumbochain.org"
  ],
  "faucets": [
    "https://protojumbo.jumbochain.org/faucet-smart"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "JNFTC",
    "symbol": "JNFTC",
    "decimals": 18
  },
  "infoURL": "https://jumbochain.org",
  "chainId": 234,
  "networkId": 234,
  "slip44": 1,
  "explorers": [
    {
      "name": "ProtoJumbo",
      "url": "https://protojumbo.jumbochain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain