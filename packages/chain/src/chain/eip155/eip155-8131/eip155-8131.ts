import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_8131: Chain = {
  name: "Qitmeer Network Testnet",
  shortName: "meertest",
  chain: "MEER",
  icon: "meer",
  rpc: [
    "https://testnet-qng.rpc.qitmeer.io",
    "https://testnet.meerlabs.com",
    "https://meer.testnet.meerfans.club",
  ],
  faucets: [
    "https://faucet.qitmeer.io",
  ],
  nativeCurrency: {
    name: "Qitmeer Testnet",
    symbol: "MEER-T",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 8131,
  networkId: 8131,
  explorers: [
    {
      name: "meerscan testnet",
      url: "https://qng-testnet.meerscan.io",
      standard: "none",
    },
  ],
}
