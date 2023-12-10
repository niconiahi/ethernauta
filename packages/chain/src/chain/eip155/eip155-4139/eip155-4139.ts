import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_4139: Chain = {
  name: "Humans.ai Testnet",
  shortName: "humans_testnet",
  chain: "Humans Testnet",
  icon: "humans-dark",
  rpc: [
    "https://evm-rpc.testnet.humans.zone",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "HEART",
    symbol: "HEART",
    decimals: 18,
  },
  infoURL: "https://humans.ai",
  chainId: 4139,
  networkId: 4139,
}
