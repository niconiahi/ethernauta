// Resolve an ENS avatar text record into a URL.
// Supports http(s), data:, and ipfs:// URIs. CAIP-19 NFT
// references are returned as a structured hint — fetching
// the NFT image is left to the caller (it requires further
// contract calls and is its own concern).

export type AvatarResult =
  | { kind: "uri"; uri: string }
  | {
    kind: "nft"
    namespace: "erc721" | "erc1155"
    chain_id: string
    contract: `0x${string}`
    token_id: string
  }

const IPFS_GATEWAY = "https://ipfs.io/ipfs/"

export function parse_avatar(
  input: string,
): AvatarResult | null {
  if (input.length === 0) return null
  if (
    input.startsWith("http://") ||
    input.startsWith("https://") ||
    input.startsWith("data:")
  ) {
    return { kind: "uri", uri: input }
  }
  if (input.startsWith("ipfs://")) {
    const path = input
      .slice("ipfs://".length)
      .replace(/^ipfs\//, "")
    return { kind: "uri", uri: `${IPFS_GATEWAY}${path}` }
  }
  // CAIP-19: eip155:<chain>/erc721:<contract>/<tokenId>
  const caip =
    /^eip155:(\d+)\/(erc721|erc1155):(0x[0-9a-fA-F]{40})\/(.+)$/.exec(
      input,
    )
  if (caip) {
    const [, chain, namespace, contract, token_id] = caip
    return {
      kind: "nft",
      namespace: namespace as "erc721" | "erc1155",
      chain_id: `eip155:${chain}`,
      contract: contract as `0x${string}`,
      token_id: token_id as string,
    }
  }
  return null
}
