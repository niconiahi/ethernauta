// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4801 = {
  name: "World Chain Sepolia Testnet",
  shortName: "wcsep",
  chain: "ETH",
  rpc: [
    "https://worldchain-sepolia.g.alchemy.com/public",
    "https://4801.rpc.thirdweb.com",
    "https://worldchain-sepolia.gateway.tenderly.co",
    "wss://worldchain-sepolia.gateway.tenderly.co",
  ],
  faucets: [
    "https://www.alchemy.com/faucets/world-chain-sepolia",
    "https://console.optimism.io/faucet",
  ],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://world.org/world-chain",
  chainId: 4801,
  networkId: 4801,
  slip44: 1,
  explorers: [
    {
      name: "etherscan",
      url: "https://sepolia.worldscan.org",
      standard: "EIP3091",
    },
    {
      name: "blockscout",
      url: "https://worldchain-sepolia.explorer.alchemy.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://worldchain-sepolia.bridge.alchemy.com",
      },
    ],
  },
} satisfies Chain
