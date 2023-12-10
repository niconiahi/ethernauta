import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_85: Chain = {
  name: "GateChain Testnet",
  shortName: "gttest",
  chain: "GTTEST",
  rpc: [
    "https://testnet.gatenode.cc",
  ],
  faucets: [
    "https://www.gatescan.org/testnet/faucet",
  ],
  nativeCurrency: {
    name: "GateToken",
    symbol: "GT",
    decimals: 18,
  },
  infoURL: "https://www.gatechain.io",
  chainId: 85,
  networkId: 85,
  explorers: [
    {
      name: "GateScan",
      url: "https://www.gatescan.org/testnet",
      standard: "EIP3091",
    },
  ],
}
