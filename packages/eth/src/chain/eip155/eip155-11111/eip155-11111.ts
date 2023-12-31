/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_11111 = {
  "name": "WAGMI",
  "shortName": "WAGMI",
  "chain": "WAGMI",
  "icon": "wagmi",
  "rpc": [
    "https://subnets.avax.network/wagmi/wagmi-chain-testnet/rpc"
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=wagmi"
  ],
  "nativeCurrency": {
    "name": "WAGMI",
    "symbol": "WGM",
    "decimals": 18
  },
  "infoURL": "https://subnets-test.avax.network/wagmi/details",
  "chainId": 11111,
  "networkId": 11111,
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets-test.avax.network/wagmi",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain