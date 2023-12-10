import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_11612: Chain = {
  name: "Sardis Testnet",
  shortName: "SRDXt",
  chain: "SRDX",
  icon: "sardisTestnet",
  rpc: [
    "https://testnet-rpc.sardisnetwork.com",
  ],
  faucets: [
    "https://faucet.sardisnetwork.com",
  ],
  nativeCurrency: {
    name: "Sardis",
    symbol: "SRDX",
    decimals: 18,
  },
  infoURL: "https://mysardis.com",
  chainId: 11612,
  networkId: 11612,
  explorers: [
    {
      name: "Sardis",
      url: "https://testnet.sardisnetwork.com",
      standard: "EIP3091",
    },
  ],
}
