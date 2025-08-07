/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_282 = {
  "name": "Deprecated Cronos zkEVM Testnet",
  "shortName": "deprecated-zkTCRO",
  "chain": "deprecatedCronosZkEVMTestnet",
  "rpc": [
    "https://deprecated.testnet.zkevm.cronos.org"
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
  "chainId": 282,
  "networkId": 282,
  "slip44": 1,
  "explorers": [
    {
      "name": "Cronos zkEVM Testnet Explorer",
      "url": "https://explorer.zkevm.cronos.org/testnet",
      "standard": "none"
    }
  ],
  "status": "deprecated"
} satisfies Chain