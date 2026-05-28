import type { Chain } from "../shared"

export const eip155_17081945 = {
  name: "SATUCHAIN Testnet",
  shortName: "satutestnet",
  chain: "SATU",
  icon: "satuchain",
  rpc: [
    "https://rpc-testnet.satuchain.com",
    "wss://rpc-testnet.satuchain.com/ws",
  ],
  faucets: ["https://faucet.satuchain.com"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Satu Testnet",
    symbol: "tSTU",
    decimals: 18,
  },
  infoURL: "https://satuchain.com",
  chainId: 17081945,
  networkId: 17081945,
  explorers: [
    {
      name: "SATUCHAIN Testnet Explorer",
      url: "https://testnet.satuchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
