/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_84531 = {
  "name": "Base Goerli Testnet",
  "shortName": "basegor",
  "chain": "ETH",
  "icon": "baseTestnet",
  "rpc": [
    "https://goerli.base.org",
    "https://base-goerli.gateway.tenderly.co",
    "wss://base-goerli.gateway.tenderly.co",
    "https://base-goerli.publicnode.com",
    "wss://base-goerli.publicnode.com"
  ],
  "faucets": [
    "https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
  ],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://base.org",
  "chainId": 84531,
  "networkId": 84531,
  "slip44": 1,
  "explorers": [
    {
      "name": "basescan",
      "url": "https://goerli.basescan.org",
      "standard": "none"
    },
    {
      "name": "basescout",
      "url": "https://base-goerli.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://base-goerli.dex.guru",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain