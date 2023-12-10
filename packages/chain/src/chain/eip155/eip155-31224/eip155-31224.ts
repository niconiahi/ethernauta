import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_31224: Chain = {
  name: "CloudTx Testnet",
  shortName: "CLD",
  chain: "CloudTx",
  icon: "cloudtx",
  rpc: [
    "https://testnet-rpc.cloudtx.finance",
  ],
  faucets: [
    "https://faucet.cloudtx.finance",
  ],
  nativeCurrency: {
    name: "CloudTx",
    symbol: "CLD",
    decimals: 18,
  },
  infoURL: "https://cloudtx.finance/",
  chainId: 31224,
  networkId: 31224,
  explorers: [
    {
      name: "cloudtxexplorer",
      url: "https://explorer.cloudtx.finance",
      standard: "EIP3091",
    },
  ],
}
