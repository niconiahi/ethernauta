import type { Chain } from "../shared"

export const eip155_30939 = {
  name: "Dilithium3 Testnet",
  shortName: "dlt-testnet",
  chain: "DLT",
  icon: "dilithium3",
  rpc: [
    "https://rpc-testnet.dilithium3.com",
    "wss://ws-testnet.dilithium3.com",
  ],
  faucets: ["https://faucet-testnet.dilithium3.com"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Dilithium3",
    symbol: "DLT",
    decimals: 18,
  },
  infoURL: "https://dilithium3.com",
  chainId: 30939,
  networkId: 30939,
  slip44: 60,
  explorers: [
    {
      name: "Dilithium3 Explorer",
      url: "https://explorer-testnet.dilithium3.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
  redFlags: [],
} satisfies Chain
