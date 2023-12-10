import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1402: Chain = {
  name: "Polygon zkEVM Testnet old",
  shortName: "zkevmtest",
  title: "Polygon zkEVM Testnet",
  chain: "Polygon",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://polygon.technology/solutions/polygon-zkevm/",
  chainId: 1402,
  networkId: 1402,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.public.zkevm-test.net",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
}
