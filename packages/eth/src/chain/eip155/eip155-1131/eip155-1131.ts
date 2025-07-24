/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1131 = {
  "name": "DeFiChain EVM Network Testnet",
  "shortName": "DFI-T",
  "chain": "defichain-evm-testnet",
  "icon": "defichain-network",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "DeFiChain",
    "symbol": "DFI",
    "decimals": 18
  },
  "infoURL": "https://meta.defichain.com/",
  "chainId": 1131,
  "networkId": 1131,
  "slip44": 1,
  "explorers": [],
  "status": "incubating"
} satisfies Chain