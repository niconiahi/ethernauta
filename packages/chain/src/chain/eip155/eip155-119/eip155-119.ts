import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_119: Chain = {
  name: "ENULS Mainnet",
  shortName: "enuls",
  chain: "ENULS",
  icon: "enuls",
  rpc: [
    "https://evmapi.nuls.io",
    "https://evmapi2.nuls.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "NULS",
    symbol: "NULS",
    decimals: 18,
  },
  infoURL: "https://nuls.io",
  chainId: 119,
  networkId: 119,
  explorers: [
    {
      name: "enulsscan",
      url: "https://evmscan.nuls.io",
      standard: "EIP3091",
    },
  ],
}
