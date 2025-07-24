/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2222 = {
  "name": "Kava",
  "shortName": "kava",
  "chain": "KAVA",
  "icon": "kava",
  "rpc": [
    "https://evm.kava.io",
    "https://kava-rpc.gateway.pokt.network",
    "https://kava-evm.rpc.thirdweb.com",
    "wss://wevm.kava.io",
    "https://kava-evm.publicnode.com",
    "wss://kava-evm.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kava",
    "symbol": "KAVA",
    "decimals": 18
  },
  "infoURL": "https://www.kava.io",
  "chainId": 2222,
  "networkId": 2222,
  "explorers": [
    {
      "name": "Kava EVM Explorer",
      "url": "https://kavascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain