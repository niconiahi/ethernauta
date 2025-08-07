// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_33999 = {
  name: "Pencils Protocol Sepolia Testnet",
  shortName: "dapp-sepolia",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Pencils Protocol Sepolia Testnet Token",
    symbol: "DAPPST",
    decimals: 18,
  },
  infoURL: "https://pencilsprotocol.io/",
  chainId: 33999,
  networkId: 33999,
  status: "incubating",
} satisfies Chain
