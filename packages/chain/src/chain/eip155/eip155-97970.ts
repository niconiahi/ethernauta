// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_97970 = {
  name: "OptimusZ7 Testnet",
  shortName: "OZ7t",
  chain: "OptimusZ7",
  icon: "OZ7Icon",
  rpc: ["https://testnet-rpc.optimusz7.com"],
  faucets: ["https://faucet.optimusz7.com"],
  nativeCurrency: {
    name: "OptimusZ7",
    symbol: "OZ7",
    decimals: 18,
  },
  infoURL: "http://optimusz7.com",
  chainId: 97970,
  networkId: 97970,
  explorers: [
    {
      name: "OptimusZ7 Testnet Explorer",
      url: "https://testnet.optimusz7.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
