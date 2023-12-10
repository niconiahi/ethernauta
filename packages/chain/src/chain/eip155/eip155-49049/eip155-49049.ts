import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_49049: Chain = {
  name: "Wireshape Floripa Testnet",
  shortName: "floripa",
  title: "Wireshape Floripa Testnet",
  chain: "Wireshape",
  icon: "wireshape",
  rpc: [
    "https://rpc-floripa.wireshape.org",
    "https://wireshape-floripa-testnet.rpc.thirdweb.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "WIRE",
    symbol: "WIRE",
    decimals: 18,
  },
  infoURL: "https://wireshape.org",
  chainId: 49049,
  networkId: 49049,
  explorers: [
    {
      name: "Wire Explorer",
      url: "https://floripa-explorer.wireshape.org",
      standard: "EIP3091",
    },
  ],
}
