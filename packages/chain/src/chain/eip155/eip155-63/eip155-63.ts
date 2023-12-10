import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_63: Chain = {
  name: "Ethereum Classic Testnet Mordor",
  shortName: "metc",
  chain: "ETC",
  rpc: [
    "https://rpc.mordor.etccooperative.org",
  ],
  faucets: [
    "https://mordor.canhaz.net/",
    "https://easy.hebeswap.com/#/faucet",
  ],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Mordor Classic Testnet Ether",
    symbol: "METC",
    decimals: 18,
  },
  infoURL: "https://github.com/eth-classic/mordor/",
  chainId: 63,
  networkId: 7,
  slip44: 63,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.com/etc/mordor",
      standard: "EIP3091",
    },
  ],
}
