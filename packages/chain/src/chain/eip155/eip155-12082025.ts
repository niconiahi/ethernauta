import type { Chain } from "../shared"

export const eip155_12082025 = {
  name: "ONFA Chain Mainnet",
  shortName: "onfachain",
  title: "ONFA Chain Mainnet",
  chain: "onfa",
  icon: "onfachain",
  rpc: [
    "https://rpc.onfachain.com",
    "https://rpc.onfachain.net",
    "https://main.onfachain.net",
    "wss://ws.onfachain.com",
    "wss://ws.onfachain.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ONFA Coin",
    symbol: "OFC",
    decimals: 18,
  },
  infoURL: "https://onfachain.com",
  chainId: 12082025,
  networkId: 12082025,
  explorers: [
    {
      name: "ONFA Scan",
      url: "https://onfascan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
