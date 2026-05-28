import type { Chain } from "../shared"

export const eip155_420420418 = {
  name: "Kusama",
  shortName: "ksm",
  chain: "KSM",
  icon: "kusama",
  rpc: [
    "https://eth-rpc-kusama.polkadot.io",
    "wss://eth-rpc-kusama.polkadot.io",
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
    name: "KSM",
    symbol: "KSM",
    decimals: 18,
  },
  infoURL: "https://polkadot.com",
  chainId: 420420418,
  networkId: 420420418,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout-kusama.polkadot.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
