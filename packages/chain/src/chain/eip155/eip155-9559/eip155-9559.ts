import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_9559: Chain = {
  name: "Neonlink Testnet",
  shortName: "testneon",
  chain: "Neonlink",
  icon: "neonlink",
  rpc: [
    "https://testnet.neonlink.io",
  ],
  faucets: [
    "https://faucet.neonlink.io/",
  ],
  nativeCurrency: {
    name: "Neonlink Native Token",
    symbol: "tNEON",
    decimals: 18,
  },
  infoURL: "https://neonlink.io",
  chainId: 9559,
  networkId: 9559,
  explorers: [
    {
      name: "Neon Blockchain Explorer",
      url: "https://testnet-scan.neonlink.io",
      standard: "EIP3091",
    },
  ],
}
