import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_155: Chain = {
  name: "Tenet Testnet",
  shortName: "tenet-testnet",
  title: "Tenet Testnet",
  chain: "TENET",
  icon: "tenet",
  rpc: [
    "https://rpc.testnet.tenet.org",
  ],
  faucets: [
    "https://faucet.testnet.tenet.org",
  ],
  nativeCurrency: {
    name: "TENET",
    symbol: "TENET",
    decimals: 18,
  },
  infoURL: "https://tenet.org/",
  chainId: 155,
  networkId: 155,
  explorers: [
    {
      name: "TenetScan Testnet",
      url: "https://testnet.tenetscan.io",
      standard: "EIP3091",
    },
  ],
}
