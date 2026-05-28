import type { Chain } from "../shared"

export const eip155_91342 = {
  name: "GIWA Sepolia Testnet",
  shortName: "giwasepolia",
  chain: "ETH",
  icon: "giwaTestnet",
  rpc: ["https://sepolia-rpc.giwa.io"],
  faucets: ["https://faucet.giwa.io"],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://giwa.io",
  chainId: 91342,
  networkId: 91342,
  slip44: 1,
  explorers: [
    {
      name: "GIWA Sepolia Blockscout",
      url: "https://sepolia-explorer.giwa.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
