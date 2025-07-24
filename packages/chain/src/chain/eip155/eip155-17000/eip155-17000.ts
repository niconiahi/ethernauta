/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_17000 = {
  "name": "Holesky",
  "shortName": "holesky",
  "title": "Ethereum Testnet Holesky",
  "chain": "ETH",
  "icon": "ethereum",
  "rpc": [
    "https://rpc.holesky.ethpandaops.io",
    "https://ethereum-holesky.publicnode.com",
    "wss://ethereum-holesky.publicnode.com"
  ],
  "faucets": [
    "https://faucet.holesky.ethpandaops.io",
    "https://holesky-faucet.pk910.de"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://holesky.ethpandaops.io",
  "chainId": 17000,
  "networkId": 17000,
  "slip44": 1,
  "explorers": [
    {
      "name": "Holesky Explorer",
      "url": "https://holesky.beaconcha.in",
      "standard": "EIP3091"
    },
    {
      "name": "otterscan-holesky",
      "url": "https://holesky.otterscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "Holesky Etherscan",
      "url": "https://holesky.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "status": "incubating"
} satisfies Chain