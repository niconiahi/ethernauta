import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_322: Chain = {
  name: "KCC Testnet",
  shortName: "kcst",
  chain: "KCC",
  rpc: [
    "https://rpc-testnet.kcc.network",
  ],
  faucets: [
    "https://faucet-testnet.kcc.network",
  ],
  nativeCurrency: {
    name: "KuCoin Testnet Token",
    symbol: "tKCS",
    decimals: 18,
  },
  infoURL: "https://scan-testnet.kcc.network",
  chainId: 322,
  networkId: 322,
  explorers: [
    {
      name: "kcc-scan-testnet",
      url: "https://scan-testnet.kcc.network",
      standard: "EIP3091",
    },
  ],
}
