/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7000 = {
  "name": "ZetaChain Mainnet",
  "shortName": "zetachain-mainnet",
  "chain": "ZetaChain",
  "icon": "zetachain",
  "rpc": [
    "https://api.mainnet.zetachain.com/evm"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "ZETA",
    "decimals": 18
  },
  "infoURL": "https://zetachain.com/docs/",
  "chainId": 7000,
  "networkId": 7000,
  "explorers": [
    {
      "name": "ZetaChain Mainnet Explorer",
      "url": "https://explorer.mainnet.zetachain.com",
      "standard": "none"
    }
  ],
  "status": "incubating"
} satisfies Chain