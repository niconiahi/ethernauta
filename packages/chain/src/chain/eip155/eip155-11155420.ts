// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11155420 = {
  name: "OP Sepolia Testnet",
  shortName: "opsep",
  chain: "ETH",
  rpc: [
    "https://sepolia.optimism.io",
    "https://optimism-sepolia.drpc.org",
    "wss://optimism-sepolia.drpc.org",
  ],
  faucets: ["https://app.optimism.io/faucet"],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://optimism.io",
  chainId: 11155420,
  networkId: 11155420,
  slip44: 1,
  explorers: [
    {
      name: "etherscan-sepolia-optimism",
      url: "https://sepolia-optimism.etherscan.io",
      standard: "EIP3091",
    },
    {
      name: "opscout",
      url: "https://optimism-sepolia.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
