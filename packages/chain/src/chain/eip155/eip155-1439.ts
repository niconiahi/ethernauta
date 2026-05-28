import type { Chain } from "../shared"

export const eip155_1439 = {
  name: "Injective Testnet",
  shortName: "injective-testnet",
  chain: "Injective",
  icon: "injective",
  rpc: [
    "https://k8s.testnet.json-rpc.injective.network",
    "wss://k8s.testnet.ws.injective.network",
    "https://injectiveevm-testnet-rpc.polkachu.com",
    "wss://injectiveevm-testnet-rpc.polkachu.com",
  ],
  faucets: ["https://testnet.faucet.injective.network"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Injective",
    symbol: "INJ",
    decimals: 18,
  },
  infoURL: "https://injective.com",
  chainId: 1439,
  networkId: 1439,
  slip44: 60,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet.blockscout.injective.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
