// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_202105 = {
  name: "DuckChain Testnet",
  shortName: "Duck-Chain-Testnet",
  title: "DuckChain Testnet",
  chain: "DuckChain",
  icon: "duckchain",
  rpc: [
    "https://testnet-rpc.duckchain.io",
    "https://testnet-rpc-hk.duckchain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TON",
    symbol: "TON",
    decimals: 18,
  },
  infoURL: "https://duckchain.io",
  chainId: 202105,
  networkId: 202105,
  explorers: [
    {
      name: "DuckChain Scan",
      url: "https://www.okx.com/web3/explorer/duckchain-testnet",
      standard: "EIP3091",
    },
    {
      name: "DuckChain Scan",
      url: "https://www.oklink.com/duckchain-testnet",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
