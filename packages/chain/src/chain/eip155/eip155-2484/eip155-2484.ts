import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2484: Chain = {
  name: "Unicorn Ultra Nebulas Testnet",
  shortName: "u2u_nebulas",
  chain: "u2u",
  icon: "u2u_nebulas",
  rpc: [
    "https://rpc-nebulas-testnet.uniultra.xyz",
  ],
  faucets: [
    "https://faucet.uniultra.xyz",
  ],
  nativeCurrency: {
    name: "Unicorn Ultra Nebulas Testnet",
    symbol: "U2U",
    decimals: 18,
  },
  infoURL: "https://uniultra.xyz",
  chainId: 2484,
  networkId: 2484,
  explorers: [
    {
      name: "U2U Explorer",
      url: "https://testnet.u2uscan.xyz",
      standard: "EIP3091",
    },
  ],
}
