import type { Chain } from "../shared"

export const eip155_420420417 = {
  name: "Polkadot Testnet",
  shortName: "pas",
  chain: "PAS",
  icon: "polkadot-testnet",
  rpc: [
    "https://services.polkadothub-rpc.com/testnet",
    "wss://services.polkadothub-rpc.com/testnet",
    "https://eth-rpc-testnet.polkadot.io",
    "wss://eth-rpc-testnet.polkadot.io",
  ],
  faucets: ["https://faucet.polkadot.io/"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "PAS",
    symbol: "PAS",
    decimals: 18,
  },
  infoURL: "https://polkadot.com",
  chainId: 420420417,
  networkId: 420420417,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout-testnet.polkadot.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
