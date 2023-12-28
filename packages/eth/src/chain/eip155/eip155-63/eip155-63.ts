/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_63 = {
  "name": "Mordor Testnet",
  "shortName": "metc",
  "title": "Ethereum Classic Mordor Testnet",
  "chain": "ETC",
  "icon": "ethereumclassictestnet",
  "rpc": [
    "https://rpc.mordor.etccooperative.org",
    "https://geth-mordor.etc-network.info"
  ],
  "faucets": [
    "https://easy.hebeswap.com/#/faucet",
    "https://faucet.mordortest.net"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Mordor Ether",
    "symbol": "METC",
    "decimals": 18
  },
  "infoURL": "https://ethereumclassic.org/development/testnets",
  "chainId": 63,
  "networkId": 7,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout-mordor",
      "url": "https://etc-mordor.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "etcnetworkinfo-expedition-mordor",
      "url": "https://explorer-expedition.etc-network.info/?network=Ethereum+Classic+at+etc-network.info+GETH+Mordor",
      "standard": "none"
    }
  ],
  "status": "active"
} satisfies Chain