/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7001 = {
  "name": "ZetaChain Testnet",
  "shortName": "zetachain-testnet",
  "chain": "ZetaChain",
  "icon": "zetachain",
  "rpc": [
    "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
    "https://zetachain-testnet.public.blastapi.io",
    "https://zetachain-athens.g.allthatnode.com/archive/evm",
    "https://7001.rpc.thirdweb.com",
    "https://zeta-chain-testnet.drpc.org"
  ],
  "faucets": [
    "https://www.zetachain.com/docs/reference/apps/get-testnet-zeta/"
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
      "name": "ZetaScan",
      "url": "https://athens.explorer.zetachain.com",
      "standard": "none"
    },
    {
      "name": "Blockscout",
      "url": "https://zetachain-athens-3.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain