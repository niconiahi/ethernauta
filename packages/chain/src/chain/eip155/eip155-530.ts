// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_530 = {
  name: "Pundi AIFX Omnilayer",
  shortName: "pundiai",
  chain: "PUNDIAI",
  icon: "pundiai",
  rpc: ["https://fx-json-web3.functionx.io:8545"],
  faucets: [],
  nativeCurrency: {
    name: "Pundi AIFX",
    symbol: "PUNDAI",
    decimals: 18,
  },
  infoURL: "https://fx.pundi.ai/",
  chainId: 530,
  networkId: 530,
  explorers: [
    {
      name: "PundiScan Explorer",
      url: "https://pundiscan.io/evm",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
