import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_91002: Chain = {
  name: "Nautilus Trition Chain",
  shortName: "NAUT",
  title: "Nautilus Trition Testnet",
  chain: "ETH",
  icon: "nautilus",
  rpc: [
    "https://triton.api.nautchain.xyz",
  ],
  faucets: [
    "https://faucet.eclipse.builders",
  ],
  nativeCurrency: {
    name: "Nautilus Zebec Testnet Tokens",
    symbol: "tZBC",
    decimals: 18,
  },
  infoURL: "https://docs.nautchain.xyz",
  chainId: 91002,
  networkId: 91002,
  explorers: [
    {
      name: "Nautscan",
      url: "https://triton.nautscan.com",
      standard: "EIP3091",
    },
  ],
}
