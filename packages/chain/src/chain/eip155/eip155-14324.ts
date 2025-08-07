// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_14324 = {
  name: "EVOLVE Testnet",
  shortName: "evo",
  chain: "EVO",
  icon: "evolveIcon",
  rpc: ["https://testnet-rpc.evolveblockchain.io"],
  faucets: ["https://faucet.evolveblockchain.io"],
  nativeCurrency: {
    name: "Evolve",
    symbol: "EVO",
    decimals: 18,
  },
  infoURL: "https://evolveblockchain.io",
  chainId: 14324,
  networkId: 14324,
  explorers: [
    {
      name: "Evolve Testnet Explorer",
      url: "https://testnet.evolveblockchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
