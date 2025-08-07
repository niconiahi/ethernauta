// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9302 = {
  name: "Galactica-Reticulum",
  shortName: "GNET",
  chain: "Galactica Testnet",
  rpc: ["https://evm-rpc-http-reticulum.galactica.com/"],
  faucets: [],
  nativeCurrency: {
    name: "Galactica Reticulum",
    symbol: "GNET",
    decimals: 18,
  },
  infoURL: "https://galactica.com",
  chainId: 9302,
  networkId: 9302,
  explorers: [
    {
      name: "Galactica-Reticulum Explorer",
      url: "https://explorer-reticulum.galactica.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
