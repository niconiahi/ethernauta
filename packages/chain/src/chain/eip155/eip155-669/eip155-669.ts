import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_669: Chain = {
  name: "JuncaChain testnet",
  shortName: "juncat",
  chain: "JuncaChain testnet",
  rpc: [
    "https://rpc-testnet.juncachain.com",
    "wss://ws-testnet.juncachain.com",
  ],
  faucets: [
    "https://faucet-testnet.juncachain.com",
  ],
  nativeCurrency: {
    name: "JuncaChain Testnet Native Token",
    symbol: "JGCT",
    decimals: 18,
  },
  infoURL: "https://junca-cash.world",
  chainId: 669,
  networkId: 669,
  explorers: [
    {
      name: "JuncaScan",
      url: "https://scan-testnet.juncachain.com",
      standard: "EIP3091",
    },
  ],
}
