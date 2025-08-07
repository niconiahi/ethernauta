// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1848 = {
  name: "Swisstronik Mainnet",
  shortName: "swtr",
  chain: "SWTR",
  icon: "swisstronik",
  rpc: [
    "https://json-rpc.mainnet.swisstronik.com/unencrypted/",
    "https://json-rpc.mainnet.swisstronik.com",
    "wss://ws-rpc.mainnet.swisstronik.com",
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
    name: "Swisstronik",
    symbol: "SWTR",
    decimals: 18,
  },
  infoURL: "https://www.swisstronik.com",
  chainId: 1848,
  networkId: 1848,
  slip44: 1,
  explorers: [
    {
      name: "Swisstronik EVM Explorer",
      url: "https://explorer-evm.mainnet.swisstronik.com",
      standard: "EIP3091",
    },
    {
      name: "Swisstronik Cosmos Explorer",
      url: "https://explorer-cosmos.mainnet.swisstronik.com/swisstronik",
      standard: "none",
    },
  ],
} satisfies Chain
