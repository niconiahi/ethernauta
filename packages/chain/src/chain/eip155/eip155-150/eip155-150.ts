import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_150: Chain = {
  name: "Six Protocol Testnet",
  shortName: "sixt",
  chain: "FIVENET",
  icon: "six",
  rpc: [
    "https://rpc-evm.fivenet.sixprotocol.net",
  ],
  faucets: [
    "https://faucet.sixprotocol.net",
  ],
  nativeCurrency: {
    name: "SIX testnet evm token",
    symbol: "tSIX",
    decimals: 18,
  },
  infoURL: "https://six.network/",
  chainId: 150,
  networkId: 150,
  explorers: [
    {
      name: "SIX Scan fivenet",
      url: "https://sixscan.io/fivenet",
      standard: "none",
    },
  ],
}
