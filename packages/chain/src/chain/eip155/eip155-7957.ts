// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7957 = {
  name: "Exorium Testnet",
  shortName: "texor",
  chain: "EXOR",
  icon: "exorium",
  rpc: [
    "https://rpc-1-testnet.exorium.net",
    "https://rpc-2-testnet.exorium.net",
    "https://rpc-testnet.exoscan.net/",
  ],
  faucets: ["https://faucet-testnet.exorium.net"],
  nativeCurrency: {
    name: "EXOR",
    symbol: "tEXOR",
    decimals: 18,
  },
  infoURL: "https://exorium.net",
  chainId: 7957,
  networkId: 7957,
  slip44: 1,
  explorers: [
    {
      name: "EXORIUM Testnet Explorer",
      url: "https://testnet.exoscan.net",
      standard: "none",
    },
  ],
} satisfies Chain
