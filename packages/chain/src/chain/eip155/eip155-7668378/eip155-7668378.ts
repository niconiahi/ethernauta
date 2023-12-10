import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_7668378: Chain = {
  name: "QL1 Testnet",
  shortName: "tqom",
  chain: "QOM",
  icon: "qom",
  rpc: [
    "https://rpc.testnet.qom.one",
  ],
  faucets: [
    "https://faucet.qom.one",
  ],
  nativeCurrency: {
    name: "Shiba Predator",
    symbol: "QOM",
    decimals: 18,
  },
  infoURL: "https://qom.one",
  chainId: 7668378,
  networkId: 7668378,
  explorers: [
    {
      name: "QL1 Testnet Explorer",
      url: "https://testnet.qom.one",
      standard: "EIP3091",
    },
  ],
  status: "incubating",
}
