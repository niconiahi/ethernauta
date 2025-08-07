// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_26988 = {
  name: "Newton Finance Testnet",
  shortName: "tNewFi",
  chain: "ETH",
  rpc: ["https://jp-rpc-testnet-newfi.newpay.io"],
  faucets: [],
  nativeCurrency: {
    name: "Newton",
    symbol: "NEW",
    decimals: 18,
  },
  infoURL: "https://newtonproject.org",
  chainId: 26988,
  networkId: 26988,
  explorers: [
    {
      name: "NewFi explorer",
      url: "https://explorer-testnet-newfi.newpay.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
