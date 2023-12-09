/* eslint no-template-curly-in-string: 0 */
export const ckb = {
  name: "Polyjuice Testnet",
  shortName: "ckb",
  chain: "CKB",
  icon: "polyjuice",
  rpc: [
    "https://godwoken-testnet-web3-rpc.ckbapp.dev",
    "ws://godwoken-testnet-web3-rpc.ckbapp.dev/ws",
  ],
  faucets: [
    "https://faucet.nervos.org/",
  ],
  nativeCurrency: {
    name: "CKB",
    symbol: "CKB",
    decimals: 8,
  },
  infoURL: "https://github.com/nervosnetwork/godwoken",
  chainId: 71393,
  networkId: 1,
} as const