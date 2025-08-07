// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_18881 = {
  name: "Ultra EVM Network Testnet",
  shortName: "ultra-testnet",
  chain: "Ultra",
  icon: "ultra",
  rpc: ["https://evm.test.ultra.eosusa.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ultra Token",
    symbol: "UOS",
    decimals: 18,
  },
  infoURL: "https://ultra.io/",
  chainId: 18881,
  networkId: 18881,
  slip44: 1,
  explorers: [
    {
      name: "Ultra EVM Testnet Explorer",
      url: "https://evmexplorer.testnet.ultra.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
