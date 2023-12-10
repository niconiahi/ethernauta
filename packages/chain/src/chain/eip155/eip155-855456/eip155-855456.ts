import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_855456: Chain = {
  name: "Dodao",
  shortName: "dodao",
  chain: "EVMCC",
  icon: "dodao",
  rpc: [
    "https://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Dodao",
    symbol: "DODAO",
    decimals: 18,
  },
  infoURL: "https://dodao.dev/",
  chainId: 855456,
  networkId: 855456,
  explorers: [
    {
      name: "Dodao Explorer",
      url: "https://tanssi-evmexplorer.netlify.app/?rpcUrl=https://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network",
      standard: "EIP3091",
    },
  ],
}
