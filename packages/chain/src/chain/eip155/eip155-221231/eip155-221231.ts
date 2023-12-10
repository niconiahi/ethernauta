import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_221231: Chain = {
  name: "Reapchain Testnet",
  shortName: "reap-testnet",
  chain: "REAP",
  icon: "reapchain",
  rpc: [
    "https://test-eth.reapchain.org",
  ],
  faucets: [
    "http://faucet.reapchain.com",
  ],
  features: [],
  nativeCurrency: {
    name: "test-Reap",
    symbol: "tREAP",
    decimals: 18,
  },
  infoURL: "https://reapchain.com",
  chainId: 221231,
  networkId: 221231,
  explorers: [
    {
      name: "Reapchain Testnet Dashboard",
      url: "https://test-dashboard.reapchain.org",
      standard: "none",
    },
  ],
}
