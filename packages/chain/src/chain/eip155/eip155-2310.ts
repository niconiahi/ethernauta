// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2310 = {
  name: "CratD2C",
  shortName: "cratd2c",
  chain: "CRATD2C",
  rpc: [
    "https://node1.cratd2csmartchain.io",
    "https://node2.cratd2csmartchain.io",
    "https://node3.cratd2csmartchain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CRATD2C",
    symbol: "CRAT",
    decimals: 18,
  },
  infoURL: "https://cratd2csmartchain.io",
  chainId: 2310,
  networkId: 2310,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.cratd2csmartchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
