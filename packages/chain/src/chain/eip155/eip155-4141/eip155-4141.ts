import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_4141: Chain = {
  name: "Tipboxcoin Testnet",
  shortName: "TPBXt",
  chain: "TPBX",
  icon: "tipboxcoinIcon",
  rpc: [
    "https://testnet-rpc.tipboxcoin.net",
  ],
  faucets: [
    "https://faucet.tipboxcoin.net",
  ],
  nativeCurrency: {
    name: "Tipboxcoin",
    symbol: "TPBX",
    decimals: 18,
  },
  infoURL: "https://tipboxcoin.net",
  chainId: 4141,
  networkId: 4141,
  explorers: [
    {
      name: "Tipboxcoin",
      url: "https://testnet.tipboxcoin.net",
      standard: "EIP3091",
    },
  ],
}
