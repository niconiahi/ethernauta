// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_90001 = {
  name: "Pundi AIFX Omnilayer Testnet",
  shortName: "dhobyghaut",
  chain: "PUNDIAI",
  icon: "pundiai",
  rpc: ["https://testnet-fx-json-web3.functionx.io:8545"],
  faucets: [],
  nativeCurrency: {
    name: "Pundi AIFX",
    symbol: "PUNDAI",
    decimals: 18,
  },
  infoURL: "https://fx.pundi.ai/",
  chainId: 90001,
  networkId: 90001,
  explorers: [
    {
      name: "PundiScan Explorer",
      url: "https://testnet.pundiscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
