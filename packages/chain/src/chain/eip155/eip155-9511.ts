import type { Chain } from "../shared"

export const eip155_9511 = {
  name: "Colossus Sepolia Testnet",
  shortName: "colsep",
  chain: "ETH",
  icon: "colossus",
  rpc: ["https://rpc.testnet.colossus.credit"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.colossus.credit/",
  chainId: 9511,
  networkId: 9511,
  slip44: 1,
  explorers: [
    {
      name: "colossus-scout",
      url: "https://explorer.testnet.colossus.credit",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
