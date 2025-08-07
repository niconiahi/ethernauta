/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_945 = {
  "name": "Subtensor EVM Testnet",
  "shortName": "bittensor-evm-testnet",
  "chain": "Bittensor",
  "icon": "bittensor",
  "rpc": [
    "https://test.chain.opentensor.ai"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "testTAO",
    "symbol": "TAO",
    "decimals": 18
  },
  "infoURL": "https://bittensor.com/",
  "chainId": 945,
  "networkId": 945,
  "slip44": 1005,
  "explorers": [
    {
      "name": "Subtensor EVM Explorer",
      "url": "https://evm-testscan.dev.opentensor.ai",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain