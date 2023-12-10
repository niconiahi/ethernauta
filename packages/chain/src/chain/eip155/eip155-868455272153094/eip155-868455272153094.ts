import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_868455272153094: Chain = {
  name: "Godwoken Testnet (V1)",
  shortName: "gw-testnet-v1-deprecated",
  chain: "GWT",
  rpc: [
    "https://godwoken-testnet-web3-v1-rpc.ckbapp.dev",
  ],
  faucets: [
    "https://homura.github.io/light-godwoken",
  ],
  nativeCurrency: {
    name: "CKB",
    symbol: "CKB",
    decimals: 8,
  },
  infoURL: "https://www.nervos.org",
  chainId: 868455272153094,
  networkId: 868455272153094,
  explorers: [
    {
      name: "GWScan Block Explorer",
      url: "https://v1.aggron.gwscan.com",
      standard: "none",
    },
  ],
  status: "deprecated",
}
