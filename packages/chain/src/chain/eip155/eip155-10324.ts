// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10324 = {
  name: "TAO EVM Testnet",
  shortName: "TAOt",
  chain: "TAO EVM",
  icon: "taoevmIcon",
  rpc: ["https://testnet-rpc.taoevm.io"],
  faucets: ["https://faucet.taoevm.io"],
  nativeCurrency: {
    name: "TAO",
    symbol: "TAO",
    decimals: 18,
  },
  infoURL: "https://taoevm.io",
  chainId: 10324,
  networkId: 10324,
  explorers: [
    {
      name: "TAO Testnet Explorer",
      url: "https://testnet.taoscan.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
