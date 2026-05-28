import type { Chain } from "../shared"

export const eip155_4270 = {
  name: "IKChain Testnet",
  shortName: "ikchain-testnet",
  chain: "IKChain",
  icon: "ikchain",
  rpc: ["https://testnet-rpc.ikchain.net"],
  faucets: ["https://testnet-explorer.ikchain.net"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "IKCrypto",
    symbol: "IKCr",
    decimals: 18,
  },
  infoURL: "https://ikchain.net",
  chainId: 4270,
  networkId: 4270,
  slip44: 1,
  explorers: [
    {
      name: "IKChain Testnet Explorer",
      url: "https://testnet-explorer.ikchain.net",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
