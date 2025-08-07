// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11166111 = {
  name: "R0AR Testnet",
  shortName: "R0AR-Test-Chain",
  chain: "R0AR Testnet",
  rpc: ["https://testnet.rpc-r0ar.io"],
  faucets: ["https://testnet.r0arfaucet.io"],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://testnet.r0arscan.io",
  chainId: 11166111,
  networkId: 11166111,
  explorers: [
    {
      name: "tracehawk",
      url: "https://testnet.r0arscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
