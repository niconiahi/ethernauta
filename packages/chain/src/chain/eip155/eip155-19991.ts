// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19991 = {
  name: "Ultra EVM Network",
  shortName: "ultra",
  chain: "Ultra",
  icon: "ultra",
  rpc: ["https://evm.ultra.eosusa.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ultra Token",
    symbol: "UOS",
    decimals: 18,
  },
  infoURL: "https://ultra.io",
  chainId: 19991,
  networkId: 19991,
  explorers: [
    {
      name: "Ultra EVM Explorer",
      url: "https://evmexplorer.ultra.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
