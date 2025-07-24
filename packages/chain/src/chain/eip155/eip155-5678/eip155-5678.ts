/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5678 = {
  "name": "Tanssi EVM ContainerChain",
  "shortName": "TanssiCC",
  "chain": "EVMCC",
  "rpc": [
    "https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Unit",
    "symbol": "Unit",
    "decimals": 18
  },
  "infoURL": "https://tanssi.network",
  "chainId": 5678,
  "networkId": 5678,
  "explorers": []
} satisfies Chain