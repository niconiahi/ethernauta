/* eslint no-template-curly-in-string: 0 */
export const sep = {
  name: "Sepolia",
  shortName: "sep",
  title: "Ethereum Testnet Sepolia",
  chain: "ETH",
  rpc: [
    "https://rpc.sepolia.org",
    "https://rpc2.sepolia.org",
    "https://rpc-sepolia.rockx.com",
    "https://rpc.sepolia.ethpandaops.io",
    "https://sepolia.infura.io/v3/${INFURA_API_KEY}",
    "wss://sepolia.infura.io/v3/${INFURA_API_KEY}",
    "https://sepolia.gateway.tenderly.co",
    "wss://sepolia.gateway.tenderly.co",
    "https://ethereum-sepolia.publicnode.com",
    "wss://ethereum-sepolia.publicnode.com",
  ],
  faucets: [
    "http://fauceth.komputing.org?chain=11155111&address=${ADDRESS}",
  ],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://sepolia.otterscan.io",
  chainId: 11155111,
  networkId: 11155111,
  explorers: [
    {
      name: "etherscan-sepolia",
      url: "https://sepolia.etherscan.io",
      standard: "EIP3091",
    },
    {
      name: "otterscan-sepolia",
      url: "https://sepolia.otterscan.io",
      standard: "EIP3091",
    },
  ],
} as const
