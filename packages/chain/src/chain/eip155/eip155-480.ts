// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_480 = {
  name: "World Chain",
  shortName: "wc",
  chain: "ETH",
  rpc: [
    "https://worldchain-mainnet.g.alchemy.com/public",
    "https://480.rpc.thirdweb.com",
    "https://worldchain-mainnet.gateway.tenderly.co",
    "wss://worldchain-mainnet.gateway.tenderly.co",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://world.org/world-chain",
  chainId: 480,
  networkId: 480,
  slip44: 1,
  explorers: [
    {
      name: "etherscan",
      url: "https://worldscan.org",
      standard: "EIP3091",
    },
    {
      name: "blockscout",
      url: "https://worldchain-mainnet.explorer.alchemy.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://world-chain.superbridge.app",
      },
      {
        url: "https://app.across.to/bridge?destinationChainId=480",
      },
      {
        url: "https://worldchain-mainnet.bridge.alchemy.com",
      },
    ],
  },
} satisfies Chain
