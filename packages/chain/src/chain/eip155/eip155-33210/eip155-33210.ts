/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_33210 = {
  "name": "Cloudverse Subnet",
  "shortName": "cloudverse",
  "chain": "CLOUDVERSE",
  "rpc": [
    "https://subnets.avax.network/cloudverse/mainnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "XCLOUD",
    "symbol": "XCLOUD",
    "decimals": 18
  },
  "infoURL": "https://muadao.build/",
  "chainId": 33210,
  "networkId": 33210,
  "explorers": [
    {
      "name": "CLOUDVERSE Explorer",
      "url": "https://subnets.avax.network/cloudverse",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain