import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_15555: Chain = {
  name: "Trust EVM Testnet",
  shortName: "TrustTestnet",
  chain: "Trust EVM Testnet",
  rpc: [
    "https://api.testnet-dev.trust.one",
  ],
  faucets: [
    "https://faucet.testnet-dev.trust.one/",
  ],
  nativeCurrency: {
    name: "Trust EVM",
    symbol: "EVM",
    decimals: 18,
  },
  infoURL: "https://www.trust.one/",
  chainId: 15555,
  networkId: 15555,
  explorers: [
    {
      name: "Trust EVM Explorer",
      url: "https://trustscan.one",
      standard: "EIP3091",
    },
  ],
}
