// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_212 = {
  name: "MAPO Makalu",
  shortName: "makalu",
  title: "MAPO Testnet Makalu",
  chain: "MAPO",
  rpc: ["https://testnet-rpc.maplabs.io"],
  faucets: ["https://faucet.mapprotocol.io"],
  nativeCurrency: {
    name: "Makalu MAPO",
    symbol: "MAPO",
    decimals: 18,
  },
  infoURL: "https://mapprotocol.io/",
  chainId: 212,
  networkId: 212,
  explorers: [
    {
      name: "maposcan",
      url: "https://testnet.maposcan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
