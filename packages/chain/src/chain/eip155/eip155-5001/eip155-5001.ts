import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_5001: Chain = {
  name: "Mantle Testnet",
  shortName: "mantle-testnet",
  chain: "ETH",
  rpc: [
    "https://rpc.testnet.mantle.xyz",
  ],
  faucets: [
    "https://faucet.testnet.mantle.xyz",
  ],
  nativeCurrency: {
    name: "Testnet Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  infoURL: "https://mantle.xyz",
  chainId: 5001,
  networkId: 5001,
  explorers: [
    {
      name: "Mantle Testnet Explorer",
      url: "https://explorer.testnet.mantle.xyz",
      standard: "EIP3091",
    },
  ],
}
