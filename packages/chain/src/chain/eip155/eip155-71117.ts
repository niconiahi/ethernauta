// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_71117 = {
  name: "Wadzchain Testnet",
  shortName: "wadzchain-testnet",
  title: "Wadzchain Testnet",
  chain: "Wadzchain-Testnet",
  icon: "wadz",
  rpc: ["https://rpc-testnet.wadzchain.io"],
  faucets: ["https://faucet-testnet.wadzchain.io"],
  nativeCurrency: {
    name: "WadzChain Coin",
    symbol: "WCO",
    decimals: 18,
  },
  infoURL: "https://www.wadzchain-network.io",
  chainId: 71117,
  networkId: 71117,
  slip44: 1,
  explorers: [
    {
      name: "Wadzchain Testnet Explorer",
      url: "https://scan-testnet.wadzchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
