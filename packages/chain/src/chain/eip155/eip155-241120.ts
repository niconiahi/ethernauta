/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_241120 = {
  "name": "Anomaly Andromeda Testnet",
  "shortName": "anomaly-andromeda-testnet",
  "title": "Anomaly Andromeda Testnet",
  "chain": "anomaly-andromeda-testnet",
  "rpc": [
    "https://rpc.anomaly-andromeda.anomalygames.io",
    "wss://ws.anomaly-andromeda.anomalygames.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TestNom",
    "symbol": "tNOM",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/anomaly-andromeda-testnet",
  "chainId": 241120,
  "networkId": 241120,
  "slip44": 60,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://andromeda.anomalyscan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-421614",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/anomaly-andromeda-testnet"
      }
    ]
  }
} satisfies Chain