/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10200 = {
  "name": "Gnosis Chiado Testnet",
  "shortName": "chi",
  "chain": "GNO",
  "icon": "gnosis",
  "rpc": [
    "https://rpc.chiadochain.net",
    "https://rpc.chiado.gnosis.gateway.fm",
    "wss://rpc.chiadochain.net/wss",
    "https://gnosis-chiado.publicnode.com",
    "wss://gnosis-chiado.publicnode.com"
  ],
  "faucets": [
    "https://gnosisfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Chiado xDAI",
    "symbol": "XDAI",
    "decimals": 18
  },
  "infoURL": "https://docs.gnosischain.com",
  "chainId": 10200,
  "networkId": 10200,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout-chiadochain",
      "url": "https://blockscout.chiadochain.net",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://gnosis-chiado.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain