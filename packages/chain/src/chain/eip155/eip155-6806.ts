// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6806 = {
  name: "RACE Testnet",
  shortName: "racesep",
  chain: "ETH",
  icon: "race",
  rpc: ["https://racetestnet.io/"],
  faucets: ["https://faucet.racetestnet.io/"],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://race.foundation/",
  chainId: 6806,
  networkId: 6806,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet.racescan.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://testnet-bridge.race.foundation/",
      },
    ],
  },
} satisfies Chain
