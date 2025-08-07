// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_84532 = {
  name: "Base Sepolia Testnet",
  shortName: "basesep",
  chain: "ETH",
  icon: "baseTestnet",
  rpc: [
    "https://sepolia.base.org",
    "https://base-sepolia-rpc.publicnode.com",
    "wss://base-sepolia-rpc.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://base.org",
  chainId: 84532,
  networkId: 84532,
  slip44: 1,
  explorers: [
    {
      name: "basescan-sepolia",
      url: "https://sepolia.basescan.org",
      standard: "EIP3091",
    },
    {
      name: "basescout",
      url: "https://base-sepolia.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
