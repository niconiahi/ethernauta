/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_240 = {
  "name": "Cronos zkEVM Testnet",
  "shortName": "zkTCRO",
  "chain": "CronosZkEVMTestnet",
  "rpc": [
    "https://testnet.zkevm.cronos.org"
  ],
  "faucets": [
    "https://zkevm.cronos.org/faucet"
  ],
  "nativeCurrency": {
    "name": "Cronos zkEVM Test Coin",
    "symbol": "zkTCRO",
    "decimals": 18
  },
  "infoURL": "https://docs-zkevm.cronos.org",
  "chainId": 240,
  "networkId": 240,
  "slip44": 1,
  "explorers": [
    {
      "name": "Cronos zkEVM Testnet Explorer",
      "url": "https://explorer.zkevm.cronos.org/testnet",
      "standard": "none"
    }
  ]
} satisfies Chain