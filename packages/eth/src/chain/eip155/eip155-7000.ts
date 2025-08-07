/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7000 = {
  "name": "ZetaChain Mainnet",
  "shortName": "zetachain-mainnet",
  "chain": "ZetaChain",
  "icon": "zetachain",
  "rpc": [
    "https://zetachain-evm.blockpi.network/v1/rpc/public",
    "https://zetachain-mainnet.g.allthatnode.com/archive/evm",
    "https://zeta-chain.drpc.org",
    "https://zetachain-mainnet.public.blastapi.io",
    "https://7000.rpc.thirdweb.com"
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
      "url": "https://explorer.zetachain.com",
      "standard": "none"
    }
  ],
  "status": "active"
} satisfies Chain