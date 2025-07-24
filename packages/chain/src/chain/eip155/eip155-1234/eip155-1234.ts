/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1234 = {
  "name": "Step Network",
  "shortName": "step",
  "title": "Step Main Network",
  "chain": "STEP",
  "icon": "step",
  "rpc": [
    "https://rpc.step.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FITFI",
    "symbol": "FITFI",
    "decimals": 18
  },
  "infoURL": "https://step.network",
  "chainId": 1234,
  "networkId": 1234,
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://stepscan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-43114",
    "bridges": [
      {
        "url": "https://bridge.step.network"
      }
    ]
  }
} satisfies Chain