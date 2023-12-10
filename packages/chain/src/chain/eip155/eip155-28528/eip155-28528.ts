import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_28528: Chain = {
  name: "Optimism Bedrock (Goerli Alpha Testnet)",
  shortName: "obgor",
  chain: "ETH",
  rpc: [
    "https://alpha-1-replica-0.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-1.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-2.bedrock-goerli.optimism.io",
    "https://alpha-1-replica-2.bedrock-goerli.optimism.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Goerli Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://community.optimism.io/docs/developers/bedrock",
  chainId: 28528,
  networkId: 28528,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.com/optimism/bedrock-alpha",
      standard: "EIP3091",
    },
  ],
}
