/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12345 = {
  "name": "Step Testnet",
  "shortName": "steptest",
  "title": "Step Test Network",
  "chain": "STEP",
  "icon": "step",
  "rpc": [
    "https://rpc.testnet.step.network"
  ],
  "faucets": [
    "https://faucet.step.network"
  ],
  "nativeCurrency": {
    "name": "FITFI",
    "symbol": "FITFI",
    "decimals": 18
  },
  "infoURL": "https://step.network",
  "chainId": 12345,
  "networkId": 12345,
  "slip44": 1,
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://testnet.stepscan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-43113"
  }
} satisfies Chain