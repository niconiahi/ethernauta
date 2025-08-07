// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1291 = {
  name: "Swisstronik Testnet",
  shortName: "swtr-testnet",
  chain: "SWTR Testnet",
  icon: "swisstronik",
  rpc: ["https://json-rpc.testnet.swisstronik.com"],
  faucets: ["https://faucet.testnet.swisstronik.com"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Swisstronik",
    symbol: "SWTR",
    decimals: 18,
  },
  infoURL: "https://www.swisstronik.com",
  chainId: 1291,
  networkId: 1291,
  slip44: 1,
  explorers: [
    {
      name: "Swisstronik Scout",
      url: "https://explorer-evm.testnet.swisstronik.com",
      standard: "none",
    },
  ],
} satisfies Chain
