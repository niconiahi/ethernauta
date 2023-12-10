import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_72: Chain = {
  name: "DxChain Testnet",
  shortName: "dxc",
  chain: "DxChain",
  rpc: [
    "https://testnet-http.dxchain.com",
  ],
  faucets: [
    "https://faucet.dxscan.io",
  ],
  nativeCurrency: {
    name: "DxChain Testnet",
    symbol: "DX",
    decimals: 18,
  },
  infoURL: "https://testnet.dxscan.io/",
  chainId: 72,
  networkId: 72,
}
