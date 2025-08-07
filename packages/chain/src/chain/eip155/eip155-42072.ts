/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_42072 = {
  "name": "AgentLayer Testnet",
  "shortName": "agent",
  "chain": "AgentLayer",
  "icon": "agentLayerIcon",
  "rpc": [
    "https://testnet-rpc.agentlayer.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Agent",
    "symbol": "AGENT",
    "decimals": 18
  },
  "infoURL": "https://agentlayer.xyz/home",
  "chainId": 42072,
  "networkId": 42072,
  "explorers": [
    {
      "name": "AgentLayer Testnet Explorer",
      "url": "https://testnet-explorer.agentlayer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain