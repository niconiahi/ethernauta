// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_281123 = {
  name: "Athene Parthenon",
  shortName: "athene-parthenon",
  chain: "athene-parthenon",
  rpc: [
    "https://rpc.parthenon.athenescan.io",
    "wss://ws.parthenon.athenescan.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://raas.gelato.network/rollups/details/public/athene-parthenon",
  chainId: 281123,
  networkId: 281123,
  slip44: 60,
  explorers: [
    {
      name: "blockscout",
      url: "https://parthenon.athenescan.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
  status: "active",
} satisfies Chain
