import type { Chain } from "../shared"

export const eip155_420420419 = {
  name: "Polkadot",
  shortName: "dot",
  chain: "DOT",
  icon: "polkadot",
  rpc: [
    "https://services.polkadothub-rpc.com/mainnet",
    "wss://services.polkadothub-rpc.com/mainnet",
    "https://eth-rpc.polkadot.io",
    "wss://eth-rpc.polkadot.io",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "DOT",
    symbol: "DOT",
    decimals: 18,
  },
  infoURL: "https://polkadot.com",
  chainId: 420420419,
  networkId: 420420419,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.polkadot.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
