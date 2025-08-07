// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_689 = {
  name: "NERO Testnet",
  shortName: "NEROT",
  chain: "NERO Chain",
  icon: "nero",
  rpc: [
    "https://rpc-testnet.nerochain.io",
    "wss://ws-testnet.nerochain.io",
  ],
  faucets: ["https://faucet-testnet.nerochain.io"],
  nativeCurrency: {
    name: "NERO",
    symbol: "NERO",
    decimals: 18,
  },
  infoURL: "https://docs.nerochain.io/",
  chainId: 689,
  networkId: 689,
  slip44: 1,
  explorers: [
    {
      name: "nero testnet scan",
      url: "https://testnet.neroscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
