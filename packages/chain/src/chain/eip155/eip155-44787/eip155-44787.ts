import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_44787: Chain = {
  name: "Celo Alfajores Testnet",
  shortName: "ALFA",
  chain: "CELO",
  rpc: [
    "https://alfajores-forno.celo-testnet.org",
    "wss://alfajores-forno.celo-testnet.org/ws",
  ],
  faucets: [
    "https://celo.org/developers/faucet",
    "https://cauldron.pretoriaresearchlab.io/alfajores-faucet",
  ],
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  infoURL: "https://docs.celo.org/",
  chainId: 44787,
  networkId: 44787,
  explorers: [
    {
      name: "Alfajoresscan",
      url: "https://alfajores.celoscan.io",
      standard: "EIP3091",
    },
  ],
}
