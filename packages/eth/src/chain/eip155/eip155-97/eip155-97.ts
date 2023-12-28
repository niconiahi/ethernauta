/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_97 = {
  "name": "BNB Smart Chain Testnet",
  "shortName": "bnbt",
  "chain": "BSC",
  "rpc": [
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
    "https://data-seed-prebsc-2-s2.bnbchain.org:8545",
    "https://data-seed-prebsc-1-s3.bnbchain.org:8545",
    "https://data-seed-prebsc-2-s3.bnbchain.org:8545",
    "https://bsc-testnet.publicnode.com",
    "wss://bsc-testnet.publicnode.com"
  ],
  "faucets": [
    "https://testnet.bnbchain.org/faucet-smart"
  ],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "tBNB",
    "decimals": 18
  },
  "infoURL": "https://www.bnbchain.org/en",
  "chainId": 97,
  "networkId": 97,
  "slip44": 1,
  "explorers": [
    {
      "name": "bscscan-testnet",
      "url": "https://testnet.bscscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain