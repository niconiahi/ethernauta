// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_33101 = {
  name: "Zilliqa EVM Testnet",
  shortName: "zil-testnet",
  chain: "ZIL",
  rpc: ["https://dev-api.zilliqa.com"],
  faucets: [
    "https://dev-wallet.zilliqa.com/faucet?network=testnet",
  ],
  nativeCurrency: {
    name: "Zilliqa",
    symbol: "ZIL",
    decimals: 18,
  },
  infoURL: "https://www.zilliqa.com/",
  chainId: 33101,
  networkId: 33101,
  slip44: 1,
  explorers: [
    {
      name: "Zilliqa EVM Explorer",
      url: "https://evmx.zilliqa.com",
      standard: "none",
    },
  ],
} satisfies Chain
