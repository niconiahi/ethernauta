import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_15557: Chain = {
  name: "EOS EVM Network Testnet",
  shortName: "eos-testnet",
  chain: "EOS",
  icon: "eos",
  rpc: [
    "https://api.testnet.evm.eosnetwork.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "EOS",
    symbol: "EOS",
    decimals: 18,
  },
  infoURL: "https://eosnetwork.com/eos-evm",
  chainId: 15557,
  networkId: 15557,
  explorers: [
    {
      name: "EOS EVM Explorer",
      url: "https://explorer.testnet.evm.eosnetwork.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.testnet.evm.eosnetwork.com",
      },
    ],
  },
}
