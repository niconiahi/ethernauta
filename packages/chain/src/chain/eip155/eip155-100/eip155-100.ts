import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_100: Chain = {
  name: "Gnosis",
  shortName: "gno",
  chain: "GNO",
  icon: "gnosis",
  rpc: [
    "https://rpc.gnosischain.com",
    "https://rpc.gnosis.gateway.fm",
    "https://rpc.ankr.com/gnosis",
    "https://gnosischain-rpc.gateway.pokt.network",
    "https://gnosis-mainnet.public.blastapi.io",
    "https://gnosis.api.onfinality.io/public",
    "https://gnosis.blockpi.network/v1/rpc/public",
    "https://web3endpoints.com/gnosischain-mainnet",
    "https://gnosis.oat.farm",
    "wss://rpc.gnosischain.com/wss",
    "https://gnosis.publicnode.com",
    "wss://gnosis.publicnode.com",
  ],
  faucets: [
    "https://gnosisfaucet.com",
    "https://stakely.io/faucet/gnosis-chain-xdai",
    "https://faucet.prussia.dev/xdai",
  ],
  nativeCurrency: {
    name: "xDAI",
    symbol: "XDAI",
    decimals: 18,
  },
  infoURL: "https://docs.gnosischain.com",
  chainId: 100,
  networkId: 100,
  slip44: 700,
  explorers: [
    {
      name: "gnosisscan",
      url: "https://gnosisscan.io",
      standard: "EIP3091",
    },
    {
      name: "blockscout",
      url: "https://gnosis.blockscout.com",
      standard: "EIP3091",
    },
    {
      name: "dexguru",
      url: "https://gnosis.dex.guru",
      standard: "EIP3091",
    },
  ],
}
