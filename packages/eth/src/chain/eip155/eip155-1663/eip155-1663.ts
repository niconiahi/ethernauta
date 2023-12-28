/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1663 = {
  "name": "Horizen Gobi Testnet",
  "shortName": "Gobi",
  "chain": "Gobi",
  "icon": "eon",
  "rpc": [
    "https://gobi-rpc.horizenlabs.io/ethv1",
    "https://rpc.ankr.com/horizen_gobi_testnet"
  ],
  "faucets": [
    "https://faucet.horizen.io"
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
    "name": "Testnet Zen",
    "symbol": "tZEN",
    "decimals": 18
  },
  "infoURL": "https://horizen.io/",
  "chainId": 1663,
  "networkId": 1663,
  "slip44": 1,
  "explorers": [
    {
      "name": "Gobi Testnet Block Explorer",
      "url": "https://gobi-explorer.horizen.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain