/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7080969 = {
  "name": "Humanity Protocol testnet",
  "shortName": "thp",
  "chain": "Humanity",
  "rpc": [
    "https://rpc.testnet.humanity.org",
    "https://humanity-testnet.g.alchemy.com/public"
  ],
  "faucets": [
    "https://faucets.alchemy.com/faucets/humanity-testnet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "tHP",
    "symbol": "tHP",
    "decimals": 18
  },
  "infoURL": "https://testnet.humanity.org",
  "chainId": 7080969,
  "networkId": 7080969,
  "explorers": [
    {
      "name": "Humanity Testnet explorer",
      "url": "https://humanity-testnet.explorer.alchemy.com",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": []
  },
  "status": "active"
} satisfies Chain