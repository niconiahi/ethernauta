/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3100 = {
  "name": "Immu3 EVM",
  "shortName": "Immu3",
  "chain": "EVMCC",
  "rpc": [
    "https://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "IMMU",
    "symbol": "IMMU",
    "decimals": 18
  },
  "infoURL": "https://immu3.io",
  "chainId": 3100,
  "networkId": 3100,
  "explorers": []
} satisfies Chain