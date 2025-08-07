// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6231991 = {
  name: "Block Chain LOL Berachain Testnet",
  shortName: "block-chain-lol-testnet",
  chain: "Block Chain LOL Berachain",
  rpc: ["https://block-chain.alt.technology"],
  faucets: ["https://faucet.block-chain.lol/"],
  nativeCurrency: {
    name: "HarryPotterObamaSonic10Inu",
    symbol: "HARRY",
    decimals: 18,
  },
  infoURL: "https://block-chain.lol/",
  chainId: 6231991,
  networkId: 6231991,
  explorers: [
    {
      name: "Block Chain LOL Berachain Testnet Blockscout Explorer",
      url: "https://explorer.block-chain.lol",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
