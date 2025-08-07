/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_388 = {
  "name": "Cronos zkEVM Mainnet",
  "shortName": "zkCRO",
  "chain": "CronosZkEVMMainnet",
  "rpc": [
    "https://mainnet.zkevm.cronos.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cronos zkEVM CRO",
    "symbol": "zkCRO",
    "decimals": 18
  },
  "infoURL": "https://cronos.org/zkevm",
  "chainId": 388,
  "networkId": 388,
  "explorers": [
    {
      "name": "Cronos zkEVM (Mainnet) Chain Explorer",
      "url": "https://explorer.zkevm.cronos.org",
      "standard": "none"
    }
  ]
} satisfies Chain