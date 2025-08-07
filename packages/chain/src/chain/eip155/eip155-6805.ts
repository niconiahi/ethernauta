// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6805 = {
  name: "RACE Mainnet",
  shortName: "raceeth",
  chain: "ETH",
  icon: "race",
  rpc: ["https://racemainnet.io/"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://race.foundation/",
  chainId: 6805,
  networkId: 6805,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://racescan.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.race.foundation/",
      },
    ],
  },
} satisfies Chain
