import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2458: Chain = {
  name: "Hybrid Chain Network Testnet",
  shortName: "thrc",
  chain: "HYBRID",
  icon: "hybrid",
  rpc: [
    "https://rpc-testnet.hybridchain.ai/",
  ],
  faucets: [
    "https://faucet-testnet.hybridchain.ai",
  ],
  nativeCurrency: {
    name: "Hybrid Chain Native Token",
    symbol: "tHRC",
    decimals: 18,
  },
  infoURL: "https://hybridchain.ai",
  chainId: 2458,
  networkId: 2458,
  explorers: [
    {
      name: "Hybrid Chain Explorer Testnet",
      url: "https://testnet.hybridscan.ai",
      standard: "none",
    },
  ],
}
