// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_61022448 = {
  name: "dKargo Warehouse Testnet",
  shortName: "dkargowarehouse",
  chain: "dKargo Warehouse",
  rpc: ["https://rpc.warehouse.dkargo.io"],
  faucets: [],
  nativeCurrency: {
    name: "dKargo",
    symbol: "DKA",
    decimals: 18,
  },
  infoURL: "https://dkargo.io",
  chainId: 61022448,
  networkId: 61022448,
} satisfies Chain
