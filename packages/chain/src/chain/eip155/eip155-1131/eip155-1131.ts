import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1131: Chain = {
  name: "DeFiChain EVM Network Testnet",
  shortName: "DFI-T",
  chain: "defichain-evm-testnet",
  icon: "defichain-network",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "DeFiChain",
    symbol: "DFI",
    decimals: 18,
  },
  infoURL: "https://meta.defichain.com/",
  chainId: 1131,
  networkId: 1131,
  explorers: [],
  status: "incubating",
}
