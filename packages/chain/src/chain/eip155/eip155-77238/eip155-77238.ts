import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_77238: Chain = {
  name: "Foundry Chain Testnet",
  shortName: "fnc",
  chain: "tFNC",
  icon: "fnc",
  rpc: [
    "https://testnet-rpc.foundryscan.org/",
  ],
  faucets: [
    "https://faucet.foundryscan.org",
  ],
  nativeCurrency: {
    name: "Foundry Chain Testnet",
    symbol: "tFNC",
    decimals: 18,
  },
  infoURL: "https://foundrychain.org",
  chainId: 77238,
  networkId: 77238,
  explorers: [
    {
      name: "Foundry Scan Testnet",
      url: "https://testnet-explorer.foundryscan.org",
      standard: "EIP3091",
    },
  ],
}
