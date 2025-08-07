// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_53457 = {
  name: "DODOchain testnet",
  shortName: "dodochain",
  title: "DODOchain testnet",
  chain: "DODOchain",
  icon: "dodochain_testnet",
  rpc: [
    "https://dodochain-testnet.alt.technology",
    "wss://dodochain-testnet.alt.technology/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "DODO",
    symbol: "DODO",
    decimals: 18,
  },
  infoURL: "https://www.dodochain.com",
  chainId: 53457,
  networkId: 53457,
  explorers: [
    {
      name: "DODOchain Testnet (Sepolia) Explorer",
      url: "https://testnet-scan.dodochain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
