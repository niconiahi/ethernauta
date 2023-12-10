import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1337702: Chain = {
  name: "Kintsugi",
  shortName: "kintsugi",
  title: "Kintsugi merge testnet",
  chain: "ETH",
  rpc: [
    "https://rpc.kintsugi.themerge.dev",
  ],
  faucets: [
    "http://fauceth.komputing.org?chain=1337702&address=${ADDRESS}",
    "https://faucet.kintsugi.themerge.dev",
  ],
  nativeCurrency: {
    name: "kintsugi Ethere",
    symbol: "kiETH",
    decimals: 18,
  },
  infoURL: "https://kintsugi.themerge.dev/",
  chainId: 1337702,
  networkId: 1337702,
  explorers: [
    {
      name: "kintsugi explorer",
      url: "https://explorer.kintsugi.themerge.dev",
      standard: "EIP3091",
    },
  ],
}
