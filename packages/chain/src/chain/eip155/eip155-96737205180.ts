// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_96737205180 = {
  name: "ALDChain Testnet",
  shortName: "ald",
  chain: "ALD",
  icon: "aldrickb",
  rpc: ["https://testnet-rpc.aldrickb.xyz"],
  faucets: ["https://faucet.aldrickb.xyz"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "ALD Token",
    symbol: "ALD",
    decimals: 18,
  },
  infoURL: "https://aldrickb.com/projects",
  chainId: 96737205180,
  networkId: 96737205180,
  explorers: [
    {
      name: "ALDChain Testnet Explorer",
      url: "https://testnet-explorer.aldrickb.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
