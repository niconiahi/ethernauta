/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7001 = {
  "name": "ZetaChain Athens 3 Testnet",
  "shortName": "zetachain-athens",
  "chain": "ZetaChain",
  "icon": "zetachain",
  "rpc": [
    "https://rpc.ankr.com/zetachain_evm_athens_testnet"
  ],
  "faucets": [
    "https://labs.zetachain.com/get-zeta"
  ],
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "ZETA",
    "decimals": 18
  },
  "infoURL": "https://zetachain.com/docs",
  "chainId": 7001,
  "networkId": 7001,
  "slip44": 1,
  "explorers": [
    {
      "name": "ZetaChain Athens Testnet Explorer",
      "url": "https://athens3.explorer.zetachain.com",
      "standard": "none"
    },
    {
      "name": "blockscout",
      "url": "https://zetachain-athens-3.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain