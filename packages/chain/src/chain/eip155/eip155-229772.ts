// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_229772 = {
  name: "Abyss Protocol",
  shortName: "abyss",
  chain: "Abyss Protocol Testnet",
  icon: "abyss",
  rpc: ["https://testnet.rpc.abyssprotocol.ai/"],
  faucets: ["https://faucet.abyssprotocol.ai/"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "AbyssETH",
    symbol: "aETH",
    decimals: 18,
  },
  infoURL: "https://abyssprotocol.ai/",
  chainId: 229772,
  networkId: 229772,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet.abyssprotocol.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
