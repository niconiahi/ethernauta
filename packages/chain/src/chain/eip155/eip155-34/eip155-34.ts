import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_34: Chain = {
  name: "SecureChain Mainnet",
  shortName: "scai",
  chain: "SCAI",
  icon: "scaiIcon",
  rpc: [
    "https://mainnet-rpc.scai.network",
  ],
  faucets: [
    "https://faucet.securechain.ai",
  ],
  nativeCurrency: {
    name: "SecureChain",
    symbol: "SCAI",
    decimals: 18,
  },
  infoURL: "https://securechain.ai",
  chainId: 34,
  networkId: 34,
  explorers: [
    {
      name: "SecureChain Mainnet",
      url: "https://explorer.securechain.ai",
      standard: "EIP3091",
    },
  ],
  redFlags: [
    "reusedChainId",
  ],
}
