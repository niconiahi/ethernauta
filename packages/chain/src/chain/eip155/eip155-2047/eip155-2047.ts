/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2047 = {
  "name": "Stratos Testnet",
  "shortName": "stos-testnet",
  "chain": "STOS",
  "rpc": [
    "https://web3-rpc-mesos.thestratos.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "infoURL": "https://www.thestratos.org",
  "chainId": 2047,
  "networkId": 2047,
  "slip44": 1,
  "explorers": [
    {
      "name": "Stratos EVM Explorer (Blockscout)",
      "url": "https://web3-explorer-mesos.thestratos.org",
      "standard": "none"
    },
    {
      "name": "Stratos Cosmos Explorer (BigDipper)",
      "url": "https://big-dipper-mesos.thestratos.org",
      "standard": "none"
    }
  ]
} satisfies Chain