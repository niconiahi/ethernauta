// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1442 = {
  name: "Polygon zkEVM Testnet",
  shortName: "testnet-zkEVM-mango",
  title: "Polygon zkEVM Testnet",
  chain: "Polygon",
  rpc: [
    "https://rpc.public.zkevm-test.net",
    "https://polygon-zkevm-testnet.drpc.org",
    "wss://polygon-zkevm-testnet.drpc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://polygon.technology/solutions/polygon-zkevm/",
  chainId: 1442,
  networkId: 1442,
  slip44: 1,
  explorers: [
    {
      name: "Polygon zkEVM explorer",
      url: "https://explorer.public.zkevm-test.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
