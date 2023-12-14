/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5 = {
  name: "Goerli",
  shortName: "gor",
  title: "Ethereum Testnet Goerli",
  chain: "ETH",
  rpc: [
    "https://goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://rpc.goerli.mudit.blog/",
    "https://ethereum-goerli.publicnode.com",
    "wss://ethereum-goerli.publicnode.com",
    "https://goerli.gateway.tenderly.co",
    "wss://goerli.gateway.tenderly.co",
  ],
  faucets: [
    "http://fauceth.komputing.org?chain=5&address=${ADDRESS}",
    "https://goerli-faucet.slock.it?address=${ADDRESS}",
    "https://faucet.goerli.mudit.blog",
  ],
  nativeCurrency: {
    name: "Goerli Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://goerli.net/#about",
  chainId: 5,
  networkId: 5,
  ens: {
    registry: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
  },
  explorers: [
    {
      name: "etherscan-goerli",
      url: "https://goerli.etherscan.io",
      standard: "EIP3091",
    },
    {
      name: "blockscout-goerli",
      url: "https://eth-goerli.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
