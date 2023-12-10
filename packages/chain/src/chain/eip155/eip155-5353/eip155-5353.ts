import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_5353: Chain = {
  name: "Tritanium Testnet",
  shortName: "ttrn",
  chain: "TRITANIUM",
  icon: "tritanium",
  rpc: [
    "https://nodetestnet-station-one.tritanium.network/",
    "https://nodetestnet-station-two.tritanium.network/",
  ],
  faucets: [
    "https://faucet.tritanium.network",
  ],
  nativeCurrency: {
    name: "Tritanium Native Token",
    symbol: "tTRN",
    decimals: 18,
  },
  infoURL: "https://tritanium.network",
  chainId: 5353,
  networkId: 5353,
  explorers: [
    {
      name: "TRITANIUM Testnet Explorer",
      url: "https://testnet.tritanium.network",
      standard: "none",
    },
  ],
}
