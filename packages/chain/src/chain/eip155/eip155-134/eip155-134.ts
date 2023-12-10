import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_134: Chain = {
  name: "iExec Sidechain",
  shortName: "rlc",
  chain: "Bellecour",
  icon: "rlc",
  rpc: [
    "https://bellecour.iex.ec",
  ],
  faucets: [],
  nativeCurrency: {
    name: "xRLC",
    symbol: "xRLC",
    decimals: 18,
  },
  infoURL: "https://iex.ec",
  chainId: 134,
  networkId: 134,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.bellecour.iex.ec",
      standard: "EIP3091",
    },
  ],
}
