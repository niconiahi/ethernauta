import type { Chain } from "../shared"

export const eip155_8691942025 = {
  name: "ONFA Chain Testnet",
  shortName: "onfatestnet",
  title: "ONFA Chain Testnet",
  chain: "onfa",
  icon: "onfachain",
  rpc: [
    "https://rpc-testnet.onfachain.com",
    "https://rpc-testnet.onfachain.net",
    "wss://ws-testnet.onfachain.com",
    "wss://ws-testnet.onfachain.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ONFA Coin",
    symbol: "OFCT",
    decimals: 18,
  },
  infoURL: "https://onfachain.com",
  chainId: 8691942025,
  networkId: 8691942025,
  explorers: [
    {
      name: "ONFA Scan",
      url: "https://onfascan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
