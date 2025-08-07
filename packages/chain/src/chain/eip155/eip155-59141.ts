// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_59141 = {
  name: "Linea Sepolia",
  shortName: "linea-sepolia",
  title: "Linea Sepolia Testnet",
  chain: "ETH",
  icon: "linea",
  rpc: [
    "https://rpc.sepolia.linea.build",
    "wss://rpc.sepolia.linea.build",
    "https://linea-sepolia.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-sepolia.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://linea-sepolia-rpc.publicnode.com",
    "wss://linea-sepolia-rpc.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Linea Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://linea.build",
  chainId: 59141,
  networkId: 59141,
  slip44: 1,
  explorers: [
    {
      name: "Etherscan",
      url: "https://sepolia.lineascan.build",
      standard: "EIP3091",
    },
    {
      name: "Blockscout",
      url: "https://explorer.sepolia.linea.build",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge.linea.build/",
      },
    ],
  },
  status: "active",
} satisfies Chain
