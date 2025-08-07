// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1337 = {
  name: "Geth Testnet",
  shortName: "geth",
  title: "Go Ethereum (Geth) Private Testnet",
  chain: "ETH",
  rpc: ["http://127.0.0.1:8545"],
  faucets: [],
  nativeCurrency: {
    name: "Geth Testnet Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://geth.ethereum.org",
  chainId: 1337,
  networkId: 1337,
  slip44: 1,
} satisfies Chain
