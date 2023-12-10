import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_404040: Chain = {
  name: "Tipboxcoin Mainnet",
  shortName: "TPBXm",
  chain: "TPBX",
  icon: "tipboxcoinIcon",
  rpc: [
    "https://mainnet-rpc.tipboxcoin.net",
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
  chainId: 404040,
  networkId: 404040,
  explorers: [
    {
      name: "Tipboxcoin",
      url: "https://tipboxcoin.net",
      standard: "EIP3091",
    },
  ],
}
