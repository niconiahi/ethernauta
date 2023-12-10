import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_18: Chain = {
  name: "ThunderCore Testnet",
  shortName: "TST",
  chain: "TST",
  rpc: [
    "https://testnet-rpc.thundercore.com",
  ],
  faucets: [
    "https://faucet-testnet.thundercore.com",
  ],
  nativeCurrency: {
    name: "ThunderCore Testnet Token",
    symbol: "TST",
    decimals: 18,
  },
  infoURL: "https://thundercore.com",
  chainId: 18,
  networkId: 18,
  explorers: [
    {
      name: "thundercore-blockscout-testnet",
      url: "https://explorer-testnet.thundercore.com",
      standard: "EIP3091",
    },
  ],
}
