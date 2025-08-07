// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_26482 = {
  name: "DucatusX Testnet",
  shortName: "ducatusx-testnet",
  chain: "DUCX",
  rpc: [
    "https://ducx-testnet-node1.rocknblock.io",
    "https://ducx-testnet-node2.rocknblock.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "DUCX",
    symbol: "DUCX",
    decimals: 18,
  },
  infoURL: "https://www.ducatuscoins.com/ducatusx",
  chainId: 26482,
  networkId: 26482,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer-testnet.ducatusx.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
