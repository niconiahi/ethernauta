/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4444444 = {
  "name": "Altar Testnet",
  "shortName": "altarTestnet",
  "chain": "Altar",
  "icon": "altarTestnet",
  "rpc": [
    "https://altar-rpc.ceremonies.ai/"
  ],
  "faucets": [
    "https://sepoliafaucet.com/"
  ],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ceremonies.gitbook.io",
  "chainId": 4444444,
  "networkId": 4444444,
  "slip44": 1,
  "explorers": [
    {
      "name": "altar testnet explorer",
      "url": "https://altar-explorer.ceremonies.ai",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://altar-testnet-yzxhzk61ck-b7590e4db247a680.testnets.rollbridge.app/"
      }
    ]
  }
} satisfies Chain