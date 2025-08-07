// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_20180427 = {
  name: "Stability Testnet",
  shortName: "stabilitytestnet",
  chain: "stabilityTestnet",
  icon: "stabilitytestnet",
  rpc: ["https://free.testnet.stabilityprotocol.com"],
  faucets: [],
  nativeCurrency: {
    name: "FREE",
    symbol: "FREE",
    decimals: 18,
  },
  infoURL: "https://stabilityprotocol.com",
  chainId: 20180427,
  networkId: 20180427,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://stability-testnet.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
