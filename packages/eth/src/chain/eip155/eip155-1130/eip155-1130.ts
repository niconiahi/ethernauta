/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1130 = {
  "name": "DeFiChain EVM Network Mainnet",
  "shortName": "DFI",
  "chain": "defichain-evm",
  "icon": "defichain-network",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "DeFiChain",
    "symbol": "DFI",
    "decimals": 18
  },
  "infoURL": "https://meta.defichain.com/",
  "chainId": 1130,
  "networkId": 1130,
  "slip44": 1130,
  "explorers": [],
  "status": "incubating"
} satisfies Chain