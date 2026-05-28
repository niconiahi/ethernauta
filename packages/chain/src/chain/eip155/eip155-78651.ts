import type { Chain } from "../shared"

export const eip155_78651 = {
  name: "Nillion Network Sepolia Testnet",
  shortName: "nilsep",
  chain: "ETH",
  icon: "nillion",
  rpc: [
    "https://rpc.testnet.nillion.network",
    "wss://rpc.testnet.nillion.network",
  ],
  faucets: ["https://faucet.testnet.nillion.network"],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://nillion.com/",
  chainId: 78651,
  networkId: 78651,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.testnet.nillion.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
