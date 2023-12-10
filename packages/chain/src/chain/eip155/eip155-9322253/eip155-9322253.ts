import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_9322253: Chain = {
  name: "Milvine",
  shortName: "milv",
  title: "XCAP Testnet Milvine",
  chain: "XCAP",
  icon: "xcap",
  rpc: [
    "https://xcap-milvine.relay.xcap.network/zj5l55ftsgi027kz4nf14vs8d89inego/rpc1",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Gas",
    symbol: "GAS",
    decimals: 18,
  },
  infoURL: "https://xcap.network/",
  chainId: 9322253,
  networkId: 9322253,
  explorers: [
    {
      name: "blockscout",
      url: "https://xcap-milvine.explorer.xcap.network",
      standard: "EIP3091",
    },
  ],
}
